import { useOrganization } from '@clerk/react-router';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import {
  addGroupMember,
  createGroup,
  deleteGroup,
  listGroupMembers,
  listGroups,
  removeGroupMember,
  updateGroup,
  type WorkspaceGroupWithCount,
} from '@/shared/lib/supabase/services/groups';
import { ChevronDown, ChevronRight, Loader2, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type OrgMember = { userId: string; label: string };

/**
 * Create/rename/delete workspace groups (Finance, Marketing, Exec…) and assign
 * members from the Clerk org. Groups are the audience unit the access-tag +
 * RLS layers (CVS-120/121) key off. Workspace-scoped by RLS.
 */
export function GroupsPanel() {
  const client = useClerkSupabase();
  const { organization, memberships } = useOrganization({
    memberships: { pageSize: 100, keepPreviousData: true },
  });

  const [groups, setGroups] = useState<WorkspaceGroupWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [membersOf, setMembersOf] = useState<Record<string, Set<string>>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const orgMembers: OrgMember[] = (memberships?.data ?? []).map((m) => ({
    userId: m.publicUserData?.userId ?? '',
    label:
      [m.publicUserData?.firstName, m.publicUserData?.lastName]
        .filter(Boolean)
        .join(' ') ||
      m.publicUserData?.identifier ||
      m.publicUserData?.userId ||
      'Unknown',
  }));

  useEffect(() => {
    if (!client) return;
    setLoading(true);
    listGroups(client)
      .then(setGroups)
      .catch(() => setGroups([]))
      .finally(() => setLoading(false));
  }, [client]);

  if (!organization) {
    return (
      <p className="text-sm text-muted-foreground/70">
        Groups apply to a workspace organization. Create or switch to an
        organization to define departments and their members.
      </p>
    );
  }

  const create = async () => {
    const name = newName.trim();
    if (!client || !name) return;
    setCreating(true);
    try {
      const g = await createGroup({ name }, client);
      setGroups((prev) =>
        [...prev, { ...g, member_count: 0 }].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );
      setNewName('');
      toast.success(`Group “${g.name}” created`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to create group';
      toast.error(msg.includes('duplicate') ? 'A group with that name already exists' : msg);
    } finally {
      setCreating(false);
    }
  };

  const remove = async (id: string, name: string) => {
    if (!client) return;
    try {
      await deleteGroup(id, client);
      setGroups((prev) => prev.filter((g) => g.id !== id));
      toast.success(`Group “${name}” deleted`);
    } catch {
      toast.error('Failed to delete group');
    }
  };

  const saveRename = async (id: string) => {
    const name = editName.trim();
    if (!client || !name) return setEditingId(null);
    try {
      await updateGroup(id, { name }, client);
      setGroups((prev) =>
        prev
          .map((g) => (g.id === id ? { ...g, name } : g))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      toast.success('Group renamed');
    } catch {
      toast.error('Failed to rename group');
    } finally {
      setEditingId(null);
    }
  };

  const toggleExpand = async (id: string) => {
    if (expandedId === id) return setExpandedId(null);
    setExpandedId(id);
    if (!membersOf[id] && client) {
      try {
        const rows = await listGroupMembers(id, client);
        setMembersOf((prev) => ({
          ...prev,
          [id]: new Set(rows.map((r) => r.user_id)),
        }));
      } catch {
        toast.error('Failed to load members');
      }
    }
  };

  const toggleMember = async (groupId: string, userId: string, next: boolean) => {
    if (!client || !userId) return;
    // optimistic
    setMembersOf((prev) => {
      const set = new Set(prev[groupId] ?? []);
      if (next) set.add(userId);
      else set.delete(userId);
      return { ...prev, [groupId]: set };
    });
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, member_count: g.member_count + (next ? 1 : -1) }
          : g
      )
    );
    try {
      if (next) await addGroupMember(groupId, userId, client);
      else await removeGroupMember(groupId, userId, client);
    } catch {
      toast.error('Failed to update membership');
      // revert
      setMembersOf((prev) => {
        const set = new Set(prev[groupId] ?? []);
        if (next) set.delete(userId);
        else set.add(userId);
        return { ...prev, [groupId]: set };
      });
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId
            ? { ...g, member_count: g.member_count + (next ? -1 : 1) }
            : g
        )
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && create()}
          placeholder="New group (e.g. Finance)"
          className="max-w-xs"
        />
        <Button onClick={create} disabled={creating || !newName.trim()} size="sm">
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add group'}
        </Button>
      </div>

      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : groups.length === 0 ? (
        <p className="text-sm text-muted-foreground/70">
          No groups yet. Add departments so you can control which teams see which
          nodes.
        </p>
      ) : (
        <div className="space-y-2">
          {groups.map((g) => {
            const expanded = expandedId === g.id;
            const memberSet = membersOf[g.id] ?? new Set<string>();
            return (
              <div key={g.id} className="rounded-md border border-border">
                <div className="flex items-center gap-2 px-3 py-2">
                  <button
                    className="flex flex-1 items-center gap-2 text-left"
                    onClick={() => toggleExpand(g.id)}
                  >
                    {expanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    {editingId === g.id ? (
                      <Input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveRename(g.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        onBlur={() => saveRename(g.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-7 max-w-[12rem]"
                      />
                    ) : (
                      <span className="text-sm font-medium">{g.name}</span>
                    )}
                    <Badge variant="secondary" className="ml-1">
                      {g.member_count}
                    </Badge>
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Rename"
                    onClick={() => {
                      setEditingId(g.id);
                      setEditName(g.name);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" title="Delete group">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete “{g.name}”?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Members are unassigned and any node audiences using this
                          group lose it. This can’t be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => remove(g.id, g.name)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {expanded && (
                  <div className="border-t border-border px-3 py-2">
                    {orgMembers.length === 0 ? (
                      <p className="text-xs text-muted-foreground/70">
                        No workspace members found.
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {orgMembers.map((m) => (
                          <label
                            key={m.userId}
                            className="flex cursor-pointer items-center gap-2 text-sm"
                          >
                            <Checkbox
                              checked={memberSet.has(m.userId)}
                              onCheckedChange={(v) =>
                                toggleMember(g.id, m.userId, v === true)
                              }
                            />
                            <span className="text-muted-foreground">{m.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
