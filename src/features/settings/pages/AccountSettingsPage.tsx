import { UserProfile } from '@clerk/react-router';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import {
  createApiKey,
  deleteApiKey,
  listApiKeys,
  type ApiKey,
} from '@/shared/lib/supabase/services/apiKeys';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { cn } from '@/shared/utils';
import {
  Bell,
  BarChart3,
  Copy,
  CreditCard,
  KeyRound,
  Monitor,
  Moon,
  Palette,
  Plug,
  Plus,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Table,
  Trash2,
  User,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const THEMES = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'night', label: 'Night', icon: Sparkles },
  { id: 'system', label: 'System', icon: Monitor },
] as const;

// Personal notification/UI preferences — local to this browser until a prefs
// table exists (see the product vault).
const PREF_KEY = 'metrimap-notif-prefs';
const PREFS = [
  { id: 'mention', label: 'Email me when I’m mentioned' },
  { id: 'assigned', label: 'Email me when I’m assigned to a metric' },
  { id: 'dataAlert', label: 'Email me on data/source alerts' },
  { id: 'inAppMention', label: 'Show in-app notifications for mentions' },
  { id: 'weeklyDigest', label: 'Send me a weekly activity digest' },
] as const;

function loadPrefs(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(PREF_KEY) || '{}');
  } catch {
    return {};
  }
}

// Connected accounts are scaffolded here; the OAuth/data pipes are owned by the
// Integrations work and the workspace-level warehouse connections.
const CONNECTORS = [
  { id: 'ga4', label: 'Google Analytics 4', icon: BarChart3 },
  { id: 'sheets', label: 'Google Sheets', icon: Table },
  { id: 'stripe', label: 'Stripe', icon: CreditCard },
] as const;

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

/**
 * Personal account settings (per-user), distinct from Workspace Settings
 * (per-org). Reached from the user menu's single "Settings" entry (CVS-87).
 * Built out per CVS-86: Profile, Appearance, Notifications, API keys — moved
 * here from Workspace Settings so personal vs workspace config is cleanly split
 * — plus Connected accounts and Billing (scaffolded, pending backend).
 */
export default function AccountSettingsPage() {
  const navigate = useNavigate();
  const client = useClerkSupabase();
  const { theme, setTheme } = useTheme();

  const [prefs, setPrefs] = useState<Record<string, boolean>>(() => loadPrefs());
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKey, setNewKey] = useState<string | null>(null);

  useEffect(() => {
    if (!client) return;
    listApiKeys(client)
      .then(setApiKeys)
      .catch(() => setApiKeys([]));
  }, [client]);

  const togglePref = (id: string) => {
    setPrefs((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(PREF_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const generateKey = async () => {
    if (!client) return;
    const name = window.prompt('Name this API key (e.g. "CI pipeline")')?.trim();
    if (!name) return;
    try {
      const { key, row } = await createApiKey(name, client);
      setApiKeys((prev) => [row, ...prev]);
      setNewKey(key);
    } catch {
      toast.error('Failed to create API key');
    }
  };

  const revokeKey = async (id: string) => {
    if (!client) return;
    try {
      await deleteApiKey(id, client);
      setApiKeys((prev) => prev.filter((k) => k.id !== id));
      toast.success('API key revoked');
    } catch {
      toast.error('Failed to revoke key');
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <PageHeader
        title="Account Settings"
        description="Your profile, appearance, notifications, and personal API keys."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/settings/workspace')}
          >
            <SlidersHorizontal className="mr-1 h-4 w-4" />
            Workspace Settings
          </Button>
        }
      />

      <div className="mt-8 space-y-5">
        {/* Profile / identity (Clerk) */}
        <Section
          icon={User}
          title="Profile"
          description="Manage your name, email, avatar, connected logins, and account security."
        >
          <div className="overflow-hidden rounded-md border border-border">
            <UserProfile routing="hash" />
          </div>
        </Section>

        {/* Appearance */}
        <Section
          icon={Palette}
          title="Appearance"
          description="Choose how Metrimap looks. Night is a deeper, warm-black variant."
        >
          <div className="flex flex-wrap gap-2">
            {THEMES.map((t) => {
              const Icon = t.icon;
              const active = (theme ?? 'system') === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={cn(
                    'flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors',
                    active
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border text-muted-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Notifications & preferences */}
        <Section
          icon={Bell}
          title="Notifications & preferences"
          description="Control what Metrimap emails and shows you. Local to this browser for now."
        >
          <div className="space-y-2">
            {PREFS.map((p) => (
              <label
                key={p.id}
                className="flex cursor-pointer items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
              >
                <span>{p.label}</span>
                <input
                  type="checkbox"
                  checked={!!prefs[p.id]}
                  onChange={() => togglePref(p.id)}
                  className="h-4 w-4 accent-primary"
                />
              </label>
            ))}
          </div>
        </Section>

        {/* Personal API keys */}
        <Section
          icon={KeyRound}
          title="API keys"
          description="Generate keys to push & pull metric values programmatically (send an x-api-key header to the metrics-api endpoint)."
          action={
            <Button variant="outline" size="sm" onClick={generateKey}>
              <Plus className="mr-1 h-4 w-4" />
              Generate key
            </Button>
          }
        >
          {newKey && (
            <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/30">
              <p className="mb-1 text-xs font-medium text-amber-800 dark:text-amber-300">
                Copy your key now — it won’t be shown again.
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 truncate rounded bg-background px-2 py-1 font-mono text-xs">
                  {newKey}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigator.clipboard.writeText(newKey).then(
                      () => toast.success('Key copied'),
                      () => toast.error('Copy failed')
                    )
                  }
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setNewKey(null)}>
                  Done
                </Button>
              </div>
            </div>
          )}
          {apiKeys.length === 0 ? (
            <p className="text-sm text-muted-foreground/70">No API keys yet.</p>
          ) : (
            <div className="space-y-2">
              {apiKeys.map((k) => (
                <div
                  key={k.id}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{k.name}</div>
                    <div className="truncate font-mono text-xs text-muted-foreground">
                      {k.key_prefix}…{' '}
                      {k.last_used_at
                        ? `· last used ${new Date(k.last_used_at).toLocaleDateString()}`
                        : '· never used'}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => revokeKey(k.id)}
                    title="Revoke key"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Connected accounts (scaffold — pipes owned by Integrations) */}
        <Section
          icon={Plug}
          title="Connected accounts"
          description="Link data sources to pull metrics automatically. Workspace-wide warehouse connections live in Workspace Settings."
        >
          <div className="space-y-2">
            {CONNECTORS.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {c.label}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-normal">
                      Soon
                    </Badge>
                    <Button variant="outline" size="sm" disabled>
                      Connect
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Billing (scaffold — pending backend) */}
        <Section
          icon={CreditCard}
          title="Billing"
          description="Your plan, usage, and payment method."
        >
          <div className="flex items-center justify-between rounded-md border border-border p-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Free plan</span>
                <Badge variant="secondary" className="font-normal">
                  Current
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Plans, usage, and invoices are coming soon.
              </p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Manage billing
            </Button>
          </div>
        </Section>
      </div>
    </div>
  );
}
