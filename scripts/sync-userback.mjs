#!/usr/bin/env node
// Trigger / test the Userback -> Linear Customer Requests bridge (edge function
// `userback-customer-requests`). In production Userback POSTs the function via
// webhook; use this for verification, manual sweeps, and retrying failures.
//
//   node scripts/sync-userback.mjs                 # sweep pending rows -> Linear
//   node scripts/sync-userback.mjs --retry-failed  # flip failed -> pending, then sweep
//   node scripts/sync-userback.mjs --sample        # inject one sample feedback, then sweep
//
// Reads from .env (git-ignored): VITE_SUPABASE_URL and USERBACK_SYNC_SECRET.
// Optional override: USERBACK_SYNC_URL (full function URL). Server-only secret —
// never ship it to the client bundle.

import fs from 'node:fs';

function loadEnv() {
  const env = { ...process.env };
  try {
    const raw = fs.readFileSync(new URL('../.env', import.meta.url), 'utf8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && env[m[1]] === undefined) {
        env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
      }
    }
  } catch {
    /* no .env — rely on process.env */
  }
  return env;
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const secret = env.USERBACK_SYNC_SECRET;

if (!supabaseUrl) throw new Error('Missing VITE_SUPABASE_URL in .env');
if (!secret) throw new Error('Missing USERBACK_SYNC_SECRET in .env');

const ref = new URL(supabaseUrl).hostname.split('.')[0];
const fnUrl =
  env.USERBACK_SYNC_URL || `https://${ref}.functions.supabase.co/userback-customer-requests`;

let body = '{}';
if (process.argv.includes('--retry-failed')) {
  body = JSON.stringify({ retryFailed: true });
} else if (process.argv.includes('--sample')) {
  // A minimal Userback-shaped payload for end-to-end verification.
  body = JSON.stringify({
    event: 'feedback.created',
    feedback: {
      id: `sample-${Date.now()}`,
      title: 'Sample feedback from sync-userback.mjs',
      description: 'Verifying the Userback → Customer Requests bridge end to end.',
      rating: 2,
      category: 'general',
      email: 'founder@acme-example.com',
      name: 'Sample Reporter',
      page_url: 'https://app.canvasm.app/canvas/demo',
    },
  });
}

console.log(`Invoking ${fnUrl} …`);
const res = await fetch(fnUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-userback-secret': secret },
  body,
});
const payload = await res.json().catch(() => ({}));
console.log(`HTTP ${res.status}`, JSON.stringify(payload, null, 2));
process.exit(res.ok ? 0 : 1);
