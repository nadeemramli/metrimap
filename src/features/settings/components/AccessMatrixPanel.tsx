import { Badge } from '@/shared/components/ui/badge';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import {
  getWorkspaceAccessTags,
  type WorkspaceAccessTag,
} from '@/shared/lib/supabase/services/accessTags';
import {
  listGroups,
  type WorkspaceGroupWithCount,
} from '@/shared/lib/supabase/services/groups';
import { Check, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Admin access matrix (CVS-122): access tags (rows) × groups (columns), a check
 * where the group is in the tag's audience — "who can see what" at a glance,
 * and a group column doubles as the "view as <group>" preview (read a column to
 * see everything that group is admitted to). Read-only; edit audiences in the
 * project tag manager (Assets → Manage Project Tags).
 */
export function AccessMatrixPanel() {
  const client = useClerkSupabase();
  const [tags, setTags] = useState<WorkspaceAccessTag[]>([]);
  const [groups, setGroups] = useState<WorkspaceGroupWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewAs, setViewAs] = useState<string | null>(null);

  useEffect(() => {
    if (!client) return;
    setLoading(true);
    Promise.all([getWorkspaceAccessTags(client), listGroups(client)])
      .then(([t, g]) => {
        setTags(t);
        setGroups(g);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [client]);

  if (loading) {
    return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
  }

  if (tags.length === 0) {
    return (
      <p className="text-sm text-muted-foreground/70">
        No access tags yet. Mark a tag as an access tag in a project (Assets →
        Manage Project Tags) to control node visibility.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-muted-foreground">View as group:</span>
        <button
          onClick={() => setViewAs(null)}
          className={`rounded-full border px-2 py-0.5 ${viewAs === null ? 'border-primary bg-primary/10' : 'border-border'}`}
        >
          All
        </button>
        {groups.map((g) => (
          <button
            key={g.id}
            onClick={() => setViewAs(g.id)}
            className={`rounded-full border px-2 py-0.5 ${viewAs === g.id ? 'border-primary bg-primary/10' : 'border-border'}`}
          >
            {g.name}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-border p-2 text-left font-medium">
                Access tag
              </th>
              {groups.map((g) => (
                <th
                  key={g.id}
                  className={`border-b border-border p-2 text-center font-medium ${viewAs === g.id ? 'bg-primary/5' : ''}`}
                >
                  {g.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tags.map((t) => {
              const audience = new Set(t.audienceGroupIds);
              return (
                <tr key={t.id}>
                  <td className="border-b border-border/60 p-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{t.name}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {t.redactionMode === 'hide_node' ? 'hide node' : 'hide value'}
                      </span>
                    </div>
                  </td>
                  {groups.map((g) => (
                    <td
                      key={g.id}
                      className={`border-b border-border/60 p-2 text-center ${viewAs === g.id ? 'bg-primary/5' : ''}`}
                    >
                      {audience.has(g.id) ? (
                        <Check className="mx-auto h-4 w-4 text-emerald-600" />
                      ) : (
                        <span className="text-muted-foreground/40">·</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {viewAs && (
        <p className="text-xs text-muted-foreground">
          Showing what <strong>{groups.find((g) => g.id === viewAs)?.name}</strong>{' '}
          can see — a checked row means members of that group are in the tag's
          audience (nodes with that tag are visible to them).
        </p>
      )}
    </div>
  );
}
