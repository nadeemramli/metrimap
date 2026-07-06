import { Button } from '@/shared/components/ui/button';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import {
  createApiKey,
  listApiKeys,
  type ApiKey,
} from '@/shared/lib/supabase/services/apiKeys';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { Bot, Copy, KeyRound, Link2, Plug, Terminal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// The hosted MCP endpoint. Overridable per environment; defaults to the planned
// production URL. (The server itself is CVS-100; hosting is being set up.)
const MCP_URL =
  (import.meta.env.VITE_MCP_URL as string | undefined) ||
  'https://mcp.canvasm.app/mcp';

function Section({
  icon: Icon,
  title,
  description,
  action,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h2 className="text-base font-semibold">{title}</h2>
        {action && <div className="ml-auto">{action}</div>}
      </div>
      {description && (
        <p className="-mt-3 mb-4 text-sm text-muted-foreground">{description}</p>
      )}
      {children}
    </section>
  );
}

function CopyBlock({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <code className="flex-1 overflow-x-auto whitespace-pre rounded bg-background px-3 py-2 font-mono text-xs">
        {text}
      </code>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          navigator.clipboard.writeText(text).then(
            () => toast.success('Copied'),
            () => toast.error('Copy failed')
          )
        }
      >
        <Copy className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

/**
 * "Connect your agent" — the in-app setup for pointing an agent (Claude
 * Cowork/Code, Codex) at Metrimap's MCP server (CVS-103). Shows the MCP URL, a
 * ready-to-paste `claude mcp add` snippet, and an inline API-key generator (keys
 * are also managed under Account Settings). OAuth "Connect" sign-in is a
 * follow-up (CVS-99). Reachable at /settings/connect.
 */
export default function ConnectAgentPage() {
  const navigate = useNavigate();
  const client = useClerkSupabase();

  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [freshKey, setFreshKey] = useState<string | null>(null);

  useEffect(() => {
    if (!client) return;
    listApiKeys(client)
      .then(setKeys)
      .catch(() => setKeys([]));
  }, [client]);

  const generateKey = async () => {
    if (!client) return;
    const name = window.prompt('Name this key (e.g. "Claude Code")')?.trim();
    if (!name) return;
    try {
      const { key, row } = await createApiKey(name, client);
      setKeys((prev) => [row, ...prev]);
      setFreshKey(key);
    } catch {
      toast.error('Failed to create API key');
    }
  };

  const keyForSnippet = freshKey ?? '<YOUR_API_KEY>';
  const cliSnippet = useMemo(
    () =>
      `claude mcp add --transport http metrimap ${MCP_URL} \\\n  --header "Authorization: Bearer ${keyForSnippet}"`,
    [keyForSnippet]
  );

  const lastUsed = keys
    .map((k) => k.last_used_at)
    .filter(Boolean)
    .sort()
    .pop();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <PageHeader
        title="Connect your agent"
        description="Point your own agent (Claude Cowork/Code, Codex) at Metrimap's MCP server so it can build & populate your metric trees. Every call runs under your account (RLS-scoped) — your key is never shared."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/settings')}
          >
            <KeyRound className="mr-1 h-4 w-4" />
            Manage keys
          </Button>
        }
      />

      <div className="mt-8 space-y-5">
        {/* MCP endpoint */}
        <Section
          icon={Link2}
          title="MCP server URL"
          description="The endpoint your agent connects to."
        >
          <CopyBlock text={MCP_URL} />
        </Section>

        {/* API key */}
        <Section
          icon={KeyRound}
          title="1. Get an API key"
          description="Non-interactive clients authenticate with a personal key (Authorization: Bearer). Copy it now — it's shown only once."
          action={
            <Button variant="outline" size="sm" onClick={generateKey}>
              Generate key
            </Button>
          }
        >
          {freshKey ? (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/30">
              <p className="mb-2 text-xs font-medium text-amber-800 dark:text-amber-300">
                Copy your key now — it won't be shown again.
              </p>
              <CopyBlock text={freshKey} />
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => setFreshKey(null)}
              >
                Done
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground/70">
              {keys.length > 0
                ? `${keys.length} key(s) exist. Generate a new one for this agent, or manage them under Account Settings.`
                : 'No keys yet — generate one to use in the command below.'}
            </p>
          )}
        </Section>

        {/* Claude */}
        <Section
          icon={Terminal}
          title="2. Add to Claude Code / Cowork"
          description="Run this in your terminal (fill in your key), or add it as an HTTP connector on claude.ai."
        >
          <CopyBlock text={cliSnippet} />
          <p className="mt-3 text-xs text-muted-foreground">
            claude.ai → Settings → Connectors → Add custom connector → paste the
            URL above and set the <code>Authorization: Bearer</code> header.
          </p>
        </Section>

        {/* Codex / other */}
        <Section
          icon={Bot}
          title="3. Codex & other MCP clients"
          description="Any HTTP MCP client works — point it at the URL and send the same Authorization header."
        >
          <CopyBlock
            text={`Authorization: Bearer ${keyForSnippet}`}
          />
        </Section>

        {/* OAuth (sign-in) — no key to copy */}
        <Section
          icon={Plug}
          title="Connect with sign-in (OAuth)"
          description="For claude.ai and Claude Desktop connectors: paste the URL, click Connect, and sign in — no key to copy."
        >
          <CopyBlock text={MCP_URL} />
          <p className="mt-3 text-xs text-muted-foreground">
            In claude.ai or Desktop → Settings → Connectors → Add custom
            connector → paste the URL above and Connect. You’ll be sent to sign
            in with your Metrimap account, then the tools appear. Signing in this
            way gives access to canvases you created.
          </p>
        </Section>

        {/* Status */}
        <Section
          icon={Bot}
          title="Connection status"
          description="Recent activity from your keys. Detailed per-client usage lands with the audit log."
        >
          <div className="rounded-md border border-border px-3 py-2 text-sm">
            {keys.length === 0 ? (
              <span className="text-muted-foreground/70">
                No keys yet — not connected.
              </span>
            ) : (
              <span>
                {keys.length} key(s) ·{' '}
                {lastUsed
                  ? `last used ${new Date(lastUsed).toLocaleString()}`
                  : 'never used yet'}
              </span>
            )}
          </div>
        </Section>
      </div>
    </div>
  );
}
