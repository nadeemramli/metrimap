import { OrganizationProfile } from '@clerk/react-router';
import { Button } from '@/shared/components/ui/button';
import { ConnectionsPanel } from '@/features/data/components/ConnectionsPanel';
import { GroupsPanel } from '@/features/settings/components/GroupsPanel';
import { AccessMatrixPanel } from '@/features/settings/components/AccessMatrixPanel';
import { ArrowLeft, Database, Grid3x3, ShieldCheck, User, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
 * Workspace (per-org) settings: data-source connections and members/roles.
 * Personal settings (profile, appearance, notifications, API keys) live at
 * /settings (Account Settings) — see CVS-86.
 */
export default function WorkspaceSettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-6 py-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Home
          </Button>
          <h1 className="text-xl font-bold">Workspace Settings</h1>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={() => navigate('/settings')}
          >
            <User className="mr-1 h-4 w-4" />
            Account Settings
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-5 px-6 py-6">
        {/* Data source connections (workspace-wide) */}
        <Section
          icon={Database}
          title="Data source connections"
          description="Warehouse connections available to Source Nodes across this workspace."
        >
          <ConnectionsPanel />
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

        {/* Groups & departments (node-level visibility audiences) */}
        <Section
          icon={ShieldCheck}
          title="Groups & departments"
          description="Group members into departments (Finance, Marketing, Exec…). Groups are the audiences that access tags and node visibility are granted to."
        >
          <GroupsPanel />
        </Section>

        {/* Access matrix — audit access tags × groups (who can see what) */}
        <Section
          icon={Grid3x3}
          title="Access matrix"
          description="Audit who can see what: access tags (rows) × groups (columns). Use “view as group” to preview a department's access."
        >
          <AccessMatrixPanel />
        </Section>
      </div>
    </div>
  );
}
