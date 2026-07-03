import { UserProfile } from '@clerk/react-router';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils';
import {
  ArrowLeft,
  Monitor,
  Moon,
  Palette,
  SlidersHorizontal,
  Sparkles,
  Sun,
  User,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useNavigate } from 'react-router-dom';

const THEMES = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'night', label: 'Night', icon: Sparkles },
  { id: 'system', label: 'System', icon: Monitor },
] as const;

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

/**
 * Personal account settings (per-user), distinct from Workspace Settings
 * (per-org). Reached from the user menu's single "Settings" entry — collapses
 * the old duplicate Profile/Settings items (CVS-87). Identity is managed inline
 * via Clerk's UserProfile; workspace-level config lives at /settings/workspace.
 */
export default function AccountSettingsPage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-6 py-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Home
          </Button>
          <h1 className="text-xl font-bold">Account Settings</h1>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={() => navigate('/settings/workspace')}
          >
            <SlidersHorizontal className="mr-1 h-4 w-4" />
            Workspace Settings
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-5 px-6 py-6">
        {/* Appearance (personal preference) */}
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
      </div>
    </div>
  );
}
