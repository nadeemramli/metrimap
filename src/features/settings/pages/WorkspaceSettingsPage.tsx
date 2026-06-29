import { OrganizationProfile } from '@clerk/react-router';
import { Button } from '@/shared/components/ui/button';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import {
  deleteConnection,
  listConnections,
  type SourceConnection,
} from '@/shared/lib/supabase/services/sourceConnections';
import { cn } from '@/shared/utils';
import {
  ArrowLeft,
  Bell,
  Database,
  Loader2,
  Monitor,
  Moon,
  Palette,
  Sparkles,
  Sun,
  Trash2,
  Users,
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

// Notification preferences are local-only for now (no backend prefs table yet —
// see docs/backlog/ui-ux-audit-2026-06-29.md).
const PREF_KEY = 'metrimap-notif-prefs';
const PREFS = [
  { id: 'mention', label: 'Email me when I’m mentioned' },
  { id: 'assigned', label: 'Email me when I’m assigned to a metric' },
  { id: 'dataAlert', label: 'Email me on data/source alerts' },
] as const;

function loadPrefs(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(PREF_KEY) || '{}');
  } catch {
    return {};
  }
}

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      {description && (
        <p className="-mt-3 mb-4 text-sm text-muted-foreground">{description}</p>
      )}
      {children}
    </section>
  );
}

export default function WorkspaceSettingsPage() {
  const navigate = useNavigate();
  const client = useClerkSupabase();
  const { theme, setTheme } = useTheme();

  const [connections, setConnections] = useState<SourceConnection[]>([]);
  const [busy, setBusy] = useState(false);
  const [prefs, setPrefs] = useState<Record<string, boolean>>(() => loadPrefs());

  useEffect(() => {
    if (!client) return;
    setBusy(true);
    listConnections(client)
      .then(setConnections)
      .catch(() => setConnections([]))
      .finally(() => setBusy(false));
  }, [client]);

  const removeConnection = async (id: string) => {
    if (!client) return;
    try {
      await deleteConnection(id, client);
      setConnections((prev) => prev.filter((c) => c.id !== id));
      toast.success('Connection removed');
    } catch {
      toast.error('Failed to remove connection');
    }
  };

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

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-6 py-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Home
          </Button>
          <h1 className="text-xl font-bold">Workspace Settings</h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-5 px-6 py-6">
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

        {/* Data source connections */}
        <Section
          icon={Database}
          title="Data source connections"
          description="Warehouse connections available to Source Nodes across this workspace."
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : connections.length === 0 ? (
            <p className="text-sm text-muted-foreground/70">
              No connections yet — add one from a Source Node’s warehouse config.
            </p>
          ) : (
            <div className="space-y-2">
              {connections.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{c.name}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {c.warehouse_type}
                      {c.host ? ` · ${c.host}` : ''}
                      {c.database ? ` / ${c.database}` : ''}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeConnection(c.id)}
                    title="Remove connection"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Notification preferences */}
        <Section
          icon={Bell}
          title="Notification preferences"
          description="Local to this browser for now."
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

        {/* Members & roles (Clerk org) */}
        <Section
          icon={Users}
          title="Members & roles"
          description="Invite teammates and manage roles for this workspace."
        >
          <div className="overflow-hidden rounded-md border border-border">
            <OrganizationProfile routing="hash" />
          </div>
        </Section>
      </div>
    </div>
  );
}
