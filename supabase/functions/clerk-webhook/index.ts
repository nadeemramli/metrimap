// Server-side user provisioning (CVS-74). Clerk posts user.* webhooks here; we
// verify the Svix signature and upsert the row into public.users with the SERVICE
// ROLE — so a user's row is reliably created/updated regardless of the client's
// token-timing race (the old client-side upsert in ClerkSupabaseProvider ran in a
// useEffect right after load, was RLS-gated, and swallowed failures).
//
// Deploy: npx supabase functions deploy clerk-webhook  (or via MCP)
// verify_jwt MUST be off — auth is the Svix signature, not a user JWT.
//
// Required env (Supabase → Edge Functions → Manage secrets):
//   CLERK_WEBHOOK_SIGNING_SECRET   the "whsec_..." from Clerk → Webhooks → your endpoint
// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are injected by the edge runtime.

import { Webhook } from 'https://esm.sh/svix@1.42.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

interface ClerkEmail {
  id: string;
  email_address: string;
}
interface ClerkUser {
  id: string;
  email_addresses?: ClerkEmail[];
  primary_email_address_id?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  image_url?: string | null;
}

function pickEmail(u: ClerkUser): string {
  const list = u.email_addresses ?? [];
  const primary = list.find((e) => e.id === u.primary_email_address_id);
  return (primary ?? list[0])?.email_address ?? '';
}

function pickName(u: ClerkUser, email: string): string {
  const full = [u.first_name, u.last_name].filter(Boolean).join(' ').trim();
  return full || u.username || email || 'User';
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const secret = Deno.env.get('CLERK_WEBHOOK_SIGNING_SECRET');
  if (!secret) return json({ error: 'CLERK_WEBHOOK_SIGNING_SECRET not configured' }, 500);

  // Verify the Svix signature over the RAW body.
  const payload = await req.text();
  const headers = {
    'svix-id': req.headers.get('svix-id') ?? '',
    'svix-timestamp': req.headers.get('svix-timestamp') ?? '',
    'svix-signature': req.headers.get('svix-signature') ?? '',
  };
  let evt: { type: string; data: ClerkUser };
  try {
    evt = new Webhook(secret).verify(payload, headers) as { type: string; data: ClerkUser };
  } catch {
    return json({ error: 'Invalid signature' }, 401);
  }

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { type, data } = evt;

  if (type === 'user.created' || type === 'user.updated') {
    const email = pickEmail(data);
    const { error } = await admin.from('users').upsert(
      {
        id: data.id,
        email,
        name: pickName(data, email),
        avatar_url: data.image_url ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
    if (error) return json({ error: error.message }, 500);
    return json({ ok: true, action: 'upsert', id: data.id });
  }

  // user.deleted: leave the row in place — ownership/collaborator FKs point at it,
  // and hard-deleting would orphan them. (Revisit with soft-delete if needed.)
  return json({ ok: true, action: 'ignored', type });
});
