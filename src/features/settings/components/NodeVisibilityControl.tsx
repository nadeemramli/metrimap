import { Badge } from '@/shared/components/ui/badge';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import {
  getCardAccessInfo,
  getNodeAccessGrants,
  setNodeAccessGrants,
  type CardAccessTag,
} from '@/shared/lib/supabase/services/accessTags';
import {
  listGroups,
  type WorkspaceGroupWithCount,
} from '@/shared/lib/supabase/services/groups';
import { Eye, Loader2, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * Per-node "Who can see this" (CVS-122): shows the access tags applied to the
 * node + their audiences, and lets an admin grant extra groups directly
 * (node_access_grants allowlist). Visibility is enforced by RLS (CVS-121); this
 * is the control surface. No access tag ⇒ visible to everyone with canvas access.
 */
export function NodeVisibilityControl({ cardId }: { cardId: string }) {
  const client = useClerkSupabase();
  const [accessTags, setAccessTags] = useState<CardAccessTag[]>([]);
  const [grants, setGrants] = useState<Set<string>>(new Set());
  const [groups, setGroups] = useState<WorkspaceGroupWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!client || !cardId) return;
    setLoading(true);
    Promise.all([
      getCardAccessInfo(cardId, client),
      getNodeAccessGrants(cardId, client),
      listGroups(client),
    ])
      .then(([tags, grantIds, gs]) => {
        setAccessTags(tags);
        setGrants(new Set(grantIds));
        setGroups(gs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [client, cardId]);

  const groupName = (id: string) => groups.find((g) => g.id === id)?.name ?? '—';

  const toggleGrant = async (groupId: string, checked: boolean) => {
    if (!client) return;
    const next = new Set(grants);
    if (checked) next.add(groupId);
    else next.delete(groupId);
    setGrants(next);
    try {
      await setNodeAccessGrants(cardId, [...next], client);
    } catch {
      setGrants(grants);
      toast.error('Failed to update node access');
    }
  };

  const restricted = accessTags.length > 0;

  if (loading) {
    return (
      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
    );
  }

  return (
    <section className="rounded-lg border border-border p-4">
      <div className="mb-3 flex items-center gap-2">
        {restricted ? (
          <Lock className="h-4 w-4 text-amber-600" />
        ) : (
          <Eye className="h-4 w-4 text-primary" />
        )}
        <h3 className="text-sm font-semibold">Who can see this</h3>
      </div>

      {!restricted ? (
        <p className="text-sm text-muted-foreground">
          No access tag — visible to everyone with canvas access. Mark a tag as an
          access tag (Assets → Manage Project Tags) to restrict this node.
        </p>
      ) : (
        <div className="space-y-3">
          <div className="space-y-2">
            {accessTags.map((t) => (
              <div key={t.tagId} className="rounded-md border border-border/60 p-2">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary">{t.name}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {t.redactionMode === 'hide_node' ? 'Hide node' : 'Hide value'}
                  </span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Audience:{' '}
                  {t.audienceGroupIds.length === 0
                    ? 'nobody yet — only owners/admins can see this'
                    : t.audienceGroupIds.map(groupName).join(', ')}
                </div>
              </div>
            ))}
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">
              Also allow specific groups (per-node override)
            </p>
            {groups.length === 0 ? (
              <p className="text-xs text-muted-foreground/70">
                No groups yet — create them in Workspace Settings → Groups.
              </p>
            ) : (
              <div className="space-y-1.5">
                {groups.map((g) => (
                  <label
                    key={g.id}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <Checkbox
                      checked={grants.has(g.id)}
                      onCheckedChange={(v) => toggleGrant(g.id, v === true)}
                    />
                    <span>{g.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
