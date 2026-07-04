import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import {
  getTagAudience,
  setTagAccess,
  setTagAudience,
  type RedactionMode,
} from '@/shared/lib/supabase/services/accessTags';
import {
  listGroups,
  type WorkspaceGroupWithCount,
} from '@/shared/lib/supabase/services/groups';
import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * Per-tag access controls for the project tag manager (CVS-120): mark a tag as
 * an access tag, choose its redaction mode, and pick the workspace groups
 * (audience) that may see nodes carrying it. No access tag = visible to all.
 */
export function AccessTagControls({
  tagId,
  isAccess: initialAccess,
  redactionMode: initialMode,
}: {
  tagId: string;
  isAccess?: boolean;
  redactionMode?: string;
}) {
  const client = useClerkSupabase();
  const [access, setAccess] = useState(!!initialAccess);
  const [mode, setMode] = useState<RedactionMode>(
    initialMode === 'hide_node' ? 'hide_node' : 'hide_value'
  );
  const [groups, setGroups] = useState<WorkspaceGroupWithCount[] | null>(null);
  const [audience, setAudience] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!client || !access) return;
    getTagAudience(tagId, client)
      .then((ids) => setAudience(new Set(ids)))
      .catch(() => {});
  }, [client, access, tagId]);

  const ensureGroups = async () => {
    if (groups || !client) return;
    try {
      setGroups(await listGroups(client));
    } catch {
      setGroups([]);
    }
  };

  const toggleAccess = async (next: boolean) => {
    if (!client) return;
    setAccess(next);
    setSaving(true);
    try {
      await setTagAccess(tagId, { isAccess: next, redactionMode: mode }, client);
      if (next) await ensureGroups();
      toast.success(next ? 'Marked as access tag' : 'Access removed');
    } catch {
      setAccess(!next);
      toast.error('Failed to update access');
    } finally {
      setSaving(false);
    }
  };

  const changeMode = async (m: RedactionMode) => {
    if (!client) return;
    setMode(m);
    try {
      await setTagAccess(tagId, { isAccess: true, redactionMode: m }, client);
    } catch {
      toast.error('Failed to set redaction mode');
    }
  };

  const toggleGroup = async (groupId: string, checked: boolean) => {
    if (!client) return;
    const next = new Set(audience);
    if (checked) next.add(groupId);
    else next.delete(groupId);
    setAudience(next);
    try {
      await setTagAudience(tagId, [...next], client);
    } catch {
      // revert
      const revert = new Set(audience);
      setAudience(revert);
      toast.error('Failed to update audience');
    }
  };

  return (
    <div className="flex items-center gap-2">
      {access && (
        <>
          <Select value={mode} onValueChange={(v) => changeMode(v as RedactionMode)}>
            <SelectTrigger className="h-7 w-[130px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hide_value">Hide value</SelectItem>
              <SelectItem value="hide_node">Hide node</SelectItem>
            </SelectContent>
          </Select>

          <Popover onOpenChange={(o) => o && ensureGroups()}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
                <Users className="h-3 w-3" />
                Audience
                {audience.size > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1">
                    {audience.size}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56">
              {groups === null ? (
                <p className="text-xs text-muted-foreground">Loading groups…</p>
              ) : groups.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No groups yet. Create them in Workspace Settings → Groups.
                </p>
              ) : (
                <div className="space-y-1.5">
                  <p className="mb-1 text-xs font-medium text-muted-foreground">
                    Groups that can see nodes with this tag
                  </p>
                  {groups.map((g) => (
                    <label
                      key={g.id}
                      className="flex cursor-pointer items-center gap-2 text-sm"
                    >
                      <Checkbox
                        checked={audience.has(g.id)}
                        onCheckedChange={(v) => toggleGroup(g.id, v === true)}
                      />
                      <span>{g.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </PopoverContent>
          </Popover>
        </>
      )}

      <div className="flex items-center gap-1.5" title="Restrict who can see nodes with this tag">
        <Switch checked={access} onCheckedChange={toggleAccess} disabled={saving} />
        <span className="text-xs text-muted-foreground">Access</span>
      </div>
    </div>
  );
}
