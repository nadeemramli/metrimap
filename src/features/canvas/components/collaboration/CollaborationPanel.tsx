// Unified collaboration surface (People / Comments+@mentions / Activity).
// Handoff + remaining backend work: the product vault
import { useProjectMembers } from '@/features/canvas/hooks/useProjectMembers';
import { postComment } from '@/features/canvas/utils/comments';
import VersionHistoryButton from '@/features/canvas/components/version-history/VersionHistoryButton';
import { useAppStore } from '@/lib/stores';
import { PresenceAvatars } from '@/shared/components/PresenceAvatars';
import type { PresenceUser } from '@/shared/hooks/usePresence';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Input } from '@/shared/components/ui/input';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Separator } from '@/shared/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';
import { Switch } from '@/shared/components/ui/switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { getProjectChangelog } from '@/shared/lib/supabase/services/changelog';
import {
  addCollaborator,
  permissionsForRole,
  removeCollaborator,
  updateCollaborator,
} from '@/shared/lib/supabase/services/collaborators';
import {
  listCommentThreads,
  listComments,
  listNotifications,
  markNotificationRead,
  updateCommentThread,
  type CommentRow,
  type CommentThreadRow,
  type NotificationRow,
} from '@/shared/lib/supabase/services/collaboration';
import { setProjectPublic } from '@/shared/lib/supabase/services/projects';
import { getClientForEnvironment } from '@/shared/utils/authenticatedClient';
import { userCodename } from '@/shared/utils/codename';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Code2,
  Download,
  FileImage,
  FileSpreadsheet,
  FileText,
  Link2,
  MessageSquare,
  Trash2,
  UserPlus,
} from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { CommentComposer } from './CommentComposer';
import { useCanvasPermission } from '@/features/canvas/hooks/useCanvasPermission';

type CollaborationTab = 'people' | 'comments' | 'activity';

interface CollaborationPanelProps {
  projectId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Active section — lets the header buttons open the panel to People/Comments/Activity. */
  activeTab?: CollaborationTab;
  onTabChange?: (tab: CollaborationTab) => void;
  /** Live presence roster (who's in the canvas right now). */
  presence?: PresenceUser[];
  /** Label of the sub-page the user is on — scopes new comments + filtering. */
  currentPage?: string;
}

// Guest collaborator tiers, most→least privileged. (Org members get write via
// workspace RLS, not these rows; 'owner' is the project creator, not assignable.)
const INVITE_ROLES = ['admin', 'editor', 'commenter', 'viewer'] as const;

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function CollaborationPanel({
  projectId,
  open,
  onOpenChange,
  activeTab,
  onTabChange,
  presence = [],
  currentPage,
}: CollaborationPanelProps) {
  const user = useAppStore((s) => s.user);

  // Controlled by the header buttons when provided; falls back to local state so
  // the panel still works standalone. In-panel tab clicks flow back to the parent.
  const [internalTab, setInternalTab] =
    React.useState<CollaborationTab>('comments');
  const tab = activeTab ?? internalTab;
  const setTab = onTabChange ?? setInternalTab;
  const { members, isLoading: membersLoading, reload: reloadMembers } =
    useProjectMembers(projectId, open, presence);

  // Comment authors show a stable pseudonymous codename — never the raw Clerk id
  // or real name (CVS-33). The People list keeps real names (intentional).
  const authorName = (id: string | null) => userCodename(id);

  // Trigger a canvas export — CanvasPage (inside the ReactFlowProvider) runs it.
  const emitExport = (format: 'png' | 'pdf' | 'csv') =>
    window.dispatchEvent(
      new CustomEvent('canvas:export', { detail: { format } })
    );

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent
        side="right"
        className="w-[440px] sm:max-w-md p-0 gap-0"
        // Keep the panel open while the user works on the canvas.
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="border-b">
          <div className="flex items-center justify-between gap-2 pr-8">
            <SheetTitle className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Collaboration
            </SheetTitle>
            {/* Export the canvas — moved here from the top toolbar. The panel is
                outside the ReactFlowProvider, so this dispatches a window event
                that CanvasPage runs (see useCanvasExport). */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => emitExport('png')}>
                  <FileImage className="mr-2 h-4 w-4" />
                  PNG image
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => emitExport('pdf')}>
                  <FileText className="mr-2 h-4 w-4" />
                  PDF document
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => emitExport('csv')}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  CSV (metric data)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SheetHeader>

        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as CollaborationTab)}
          className="flex-1 flex flex-col min-h-0"
        >
          <TabsList className="grid grid-cols-3 mx-4 mt-3">
            <TabsTrigger value="people">People</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <PeopleTab
            projectId={projectId}
            members={members}
            membersLoading={membersLoading}
            reloadMembers={reloadMembers}
            presence={presence}
          />

          <CommentsTab
            projectId={projectId}
            open={open}
            members={members}
            userId={user?.id}
            authorName={authorName}
            currentPage={currentPage}
          />

          <ActivityTab projectId={projectId} open={open} userId={user?.id} />
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

/* ----------------------------- People ----------------------------- */

function PeopleTab({
  projectId,
  members,
  membersLoading,
  reloadMembers,
  presence,
}: {
  projectId?: string;
  members: ReturnType<typeof useProjectMembers>['members'];
  membersLoading: boolean;
  reloadMembers: () => void;
  presence: PresenceUser[];
}) {
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [inviteRole, setInviteRole] =
    React.useState<(typeof INVITE_ROLES)[number]>('editor');
  const [inviting, setInviting] = React.useState(false);
  const [isPublic, setIsPublic] = React.useState(false);
  const [togglingPublic, setTogglingPublic] = React.useState(false);

  const handleInvite = async () => {
    if (!projectId || !inviteEmail.trim()) return;
    setInviting(true);
    try {
      await addCollaborator(
        projectId,
        inviteEmail.trim(),
        inviteRole,
        undefined, // permissions derived from role
        getClientForEnvironment()
      );
      toast.success(`Invited ${inviteEmail.trim()}`);
      setInviteEmail('');
      reloadMembers();
    } catch (e: any) {
      console.error('Invite failed', e);
      toast.error(e?.message || 'Could not invite member');
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (collaboratorId: string, role: string) => {
    try {
      await updateCollaborator(
        collaboratorId,
        // Keep permissions coherent with the role so RLS never disagrees.
        { role, permissions: permissionsForRole(role) },
        getClientForEnvironment()
      );
      toast.success('Role updated');
      reloadMembers();
    } catch (e: any) {
      console.error('Role update failed', e);
      toast.error('Could not update role');
    }
  };

  const handleRemove = async (collaboratorId: string) => {
    try {
      await removeCollaborator(collaboratorId, getClientForEnvironment());
      toast.success('Member removed');
      reloadMembers();
    } catch (e: any) {
      console.error('Remove failed', e);
      toast.error('Could not remove member');
    }
  };

  const handleTogglePublic = async (next: boolean) => {
    if (!projectId) return;
    setTogglingPublic(true);
    try {
      await setProjectPublic(projectId, next, getClientForEnvironment());
      setIsPublic(next);
      toast.success(next ? 'Canvas is now public' : 'Canvas is now private');
    } catch (e: any) {
      console.error('Toggle public failed', e);
      toast.error('Could not change visibility');
    } finally {
      setTogglingPublic(false);
    }
  };

  const handleCopyLink = async () => {
    if (!projectId) return;
    // The /canvas route is gated by ProtectedRoute (login required), so a
    // shareable "public" link must point at the no-auth read-only embed view.
    // When the canvas is private, the canvas link is the right one (for members).
    const url = isPublic
      ? `${window.location.origin}/embed/${projectId}`
      : `${window.location.origin}/canvas/${projectId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success(
        isPublic
          ? 'Public link copied (read-only view)'
          : 'Link copied — recipients must sign in (make the canvas public to share read-only)'
      );
    } catch {
      toast.error('Could not copy link');
    }
  };

  const handleCopyEmbedLink = async () => {
    if (!projectId) return;
    const url = `${window.location.origin}/embed/${projectId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Embed link copied — works only while public');
    } catch {
      toast.error('Could not copy link');
    }
  };

  return (
    <TabsContent value="people" className="flex-1 min-h-0 mt-3">
      <ScrollArea className="h-full">
        <div className="px-4 pb-6 space-y-5">
          {/* Online now (ephemeral presence) */}
          {presence.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Online now
              </h3>
              <div className="flex items-center gap-3">
                <PresenceAvatars roster={presence} max={8} />
                <span className="text-xs text-muted-foreground">
                  {presence.length} active
                </span>
              </div>
            </div>
          )}

          {/* Members */}
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Members
            </h3>
            {membersLoading && (
              <p className="text-sm text-muted-foreground">Loading…</p>
            )}
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-xs">
                    {initials(m.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {m.name}
                    {m.isSelf && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        (you)
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {m.email}
                  </div>
                </div>
                {m.collaboratorId ? (
                  <>
                    <Select
                      value={m.role || 'member'}
                      onValueChange={(v) =>
                        handleRoleChange(m.collaboratorId!, v)
                      }
                    >
                      <SelectTrigger className="h-7 w-24 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(
                          new Set([
                            'admin',
                            'editor',
                            'commenter',
                            'viewer',
                            m.role || 'member', // keep legacy/owner value selectable
                          ])
                        ).map((r) => (
                          <SelectItem key={r} value={r} className="text-xs">
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemove(m.collaboratorId!)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </>
                ) : (
                  <Badge variant="secondary" className="text-[10px]">
                    {m.role || 'owner'}
                  </Badge>
                )}
              </div>
            ))}
          </div>

          {/* Invite */}
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Invite by email
            </h3>
            <div className="flex items-center gap-2">
              <Input
                type="email"
                placeholder="name@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="h-8 text-sm"
              />
              <Select
                value={inviteRole}
                onValueChange={(v) =>
                  setInviteRole(v as (typeof INVITE_ROLES)[number])
                }
              >
                <SelectTrigger className="h-8 w-24 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INVITE_ROLES.map((r) => (
                    <SelectItem key={r} value={r} className="text-xs">
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                className="h-8 gap-1"
                onClick={handleInvite}
                disabled={inviting || !inviteEmail.trim()}
              >
                <UserPlus className="h-3.5 w-3.5" />
                Add
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              The person must already have an account.
            </p>
          </div>

          <Separator />

          {/* Public link (folds in the old Share button) */}
          <div className="space-y-3">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Share link
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm">Public link</div>
                  <div className="text-xs text-muted-foreground">
                    Anyone with the link can view
                  </div>
                </div>
              </div>
              <Switch
                checked={isPublic}
                disabled={togglingPublic}
                onCheckedChange={handleTogglePublic}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5"
                onClick={handleCopyLink}
              >
                <Link2 className="h-3.5 w-3.5" />
                Copy link
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5"
                onClick={handleCopyEmbedLink}
                title="Read-only embed for Notion / Confluence / iframe"
              >
                <Code2 className="h-3.5 w-3.5" />
                Embed
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </TabsContent>
  );
}

/* ----------------------------- Comments ----------------------------- */

function CommentsTab({
  projectId,
  open,
  members,
  userId,
  authorName,
  currentPage,
}: {
  projectId?: string;
  open: boolean;
  members: ReturnType<typeof useProjectMembers>['members'];
  userId?: string;
  authorName: (id: string | null) => string;
  currentPage?: string;
}) {
  const { canComment, loading: permLoading } = useCanvasPermission(projectId);
  const [threads, setThreads] = React.useState<CommentThreadRow[]>([]);
  const [counts, setCounts] = React.useState<Record<string, number>>({});
  const [selected, setSelected] = React.useState<string | null>(null);
  const [comments, setComments] = React.useState<CommentRow[]>([]);
  const [posting, setPosting] = React.useState(false);
  const [pageOnly, setPageOnly] = React.useState(false);

  const loadThreads = React.useCallback(async () => {
    if (!projectId) return;
    try {
      const client = getClientForEnvironment();
      const t = await listCommentThreads(projectId, client);
      setThreads(t);
      const entries = await Promise.all(
        t.map(async (thr) => {
          const c = await listComments(thr.id, client);
          return [thr.id, c.length] as const;
        })
      );
      setCounts(Object.fromEntries(entries));
    } catch (e) {
      console.error('Failed to load threads', e);
    }
  }, [projectId]);

  React.useEffect(() => {
    if (open) void loadThreads();
  }, [open, loadThreads]);

  const openThread = React.useCallback(async (threadId: string) => {
    setSelected(threadId);
    try {
      const c = await listComments(threadId, getClientForEnvironment());
      setComments(c);
    } catch (e) {
      console.error('Failed to load comments', e);
    }
  }, []);

  // Live sync: append comments inserted by other sessions on the open thread.
  React.useEffect(() => {
    if (!selected) return;
    const client = getClientForEnvironment();
    const channel = client
      .channel(`panel-comments-${selected}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `thread_id=eq.${selected}`,
        },
        (payload) => {
          const row = payload.new as CommentRow;
          setComments((prev) =>
            prev.some((c) => c.id === row.id) ? prev : [...prev, row]
          );
        }
      )
      .subscribe();
    return () => {
      void client.removeChannel(channel);
    };
  }, [selected]);

  // Auto-open a thread when a canvas comment-node broadcasts navigation.
  React.useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { threadId?: string };
      if (detail?.threadId) void openThread(detail.threadId);
    };
    window.addEventListener('collab:navigate', handler);
    return () => window.removeEventListener('collab:navigate', handler);
  }, [openThread]);

  const handlePost = async (content: string, mentionedIds: string[]) => {
    if (!projectId) return;
    setPosting(true);
    try {
      const { threadId, comment } = await postComment({
        threadId: selected,
        projectId,
        source: 'canvas',
        context: selected
          ? undefined
          : { general: true, page: currentPage ?? null },
        content,
        mentionedIds,
        userId,
      });
      setSelected(threadId);
      setComments((prev) => [...prev, comment]);
      setCounts((prev) => ({
        ...prev,
        [threadId]: (prev[threadId] || 0) + 1,
      }));
      if (!threads.some((t) => t.id === threadId)) void loadThreads();
    } catch (e: any) {
      console.error('Failed to post comment', e);
      toast.error(e?.message || 'Could not post comment');
    } finally {
      setPosting(false);
    }
  };

  const handleResolve = async (threadId: string) => {
    try {
      await updateCommentThread(
        threadId,
        { is_resolved: true },
        getClientForEnvironment()
      );
      setThreads((prev) =>
        prev.map((t) => (t.id === threadId ? { ...t, is_resolved: true } : t))
      );
      toast.success('Thread resolved');
    } catch (e) {
      console.error('Resolve failed', e);
      toast.error('Could not resolve thread');
    }
  };

  const visibleThreads =
    pageOnly && currentPage
      ? threads.filter((t) => (t.context as any)?.page === currentPage)
      : threads;

  // Thread detail view
  if (selected) {
    const thread = threads.find((t) => t.id === selected);
    return (
      <TabsContent value="comments" className="flex-1 min-h-0 mt-3 flex flex-col">
        <div className="px-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 -ml-2 gap-1 text-muted-foreground"
            onClick={() => {
              setSelected(null);
              setComments([]);
            }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All threads
          </Button>
          {thread && !thread.is_resolved && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-muted-foreground"
              onClick={() => handleResolve(selected)}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Resolve
            </Button>
          )}
        </div>
        <ScrollArea className="flex-1 min-h-0 px-4 mt-2">
          <div className="space-y-3 pb-3">
            {comments.map((c) => (
              <div key={c.id} className="flex items-start gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[10px]">
                    {initials(authorName(c.author_id))}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-muted-foreground">
                    {authorName(c.author_id)} •{' '}
                    {new Date(c.created_at).toLocaleString()}
                  </div>
                  <div className="text-sm leading-snug whitespace-pre-wrap">
                    {c.content}
                  </div>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-sm text-muted-foreground">No comments yet.</p>
            )}
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          {canComment || permLoading ? (
            <CommentComposer
              members={members}
              onPost={handlePost}
              isPosting={posting}
              placeholder="Reply…  (type @ to mention)"
            />
          ) : (
            <p className="text-xs text-muted-foreground">
              You have view-only access — you can’t comment on this canvas.
            </p>
          )}
        </div>
      </TabsContent>
    );
  }

  // Thread list view
  return (
    <TabsContent value="comments" className="flex-1 min-h-0 mt-3 flex flex-col">
      {currentPage && (
        <div className="px-4 pb-2 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">
            {pageOnly ? `Threads on ${currentPage}` : 'All threads'}
          </span>
          <Button
            variant={pageOnly ? 'secondary' : 'ghost'}
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => setPageOnly((v) => !v)}
          >
            This page
          </Button>
        </div>
      )}
      <ScrollArea className="flex-1 min-h-0 px-4">
        <div className="space-y-2 pb-3">
          {visibleThreads.length === 0 && (
            <p className="text-sm text-muted-foreground py-4">
              {pageOnly
                ? `No threads on ${currentPage} yet.`
                : 'No comment threads yet. Start one below.'}
            </p>
          )}
          {visibleThreads.map((t) => (
            <button
              key={t.id}
              onClick={() => openThread(t.id)}
              className="w-full text-left rounded-lg border p-3 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium capitalize">
                  {t.source}
                  {t.context && (t.context as any).cardId
                    ? ' · card'
                    : (t.context as any)?.nodeId
                      ? ' · pin'
                      : ''}
                </span>
                <div className="flex items-center gap-2">
                  {t.is_resolved && (
                    <Badge variant="secondary" className="text-[10px] gap-0.5">
                      <Check className="h-3 w-3" />
                      Resolved
                    </Badge>
                  )}
                  <span className="text-[11px] text-muted-foreground">
                    {counts[t.id] ?? 0} 💬
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">
                {new Date(t.updated_at).toLocaleString()}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        {canComment || permLoading ? (
          <>
            <div className="text-xs font-medium text-muted-foreground mb-2">
              New comment
            </div>
            <CommentComposer
              members={members}
              onPost={handlePost}
              isPosting={posting}
            />
          </>
        ) : (
          <p className="text-xs text-muted-foreground">
            You have view-only access — you can’t comment on this canvas.
          </p>
        )}
      </div>
    </TabsContent>
  );
}

/* ----------------------------- Activity ----------------------------- */

interface ChangeDay {
  date: string;
  changes: Array<{
    id: string;
    title: string;
    description: string;
    author: string;
    timestamp: string;
  }>;
}

function ActivityTab({
  projectId,
  open,
  userId,
}: {
  projectId?: string;
  open: boolean;
  userId?: string;
}) {
  const [notifications, setNotifications] = React.useState<NotificationRow[]>(
    []
  );
  const [changes, setChanges] = React.useState<ChangeDay[]>([]);

  React.useEffect(() => {
    if (!open || !projectId) return;
    const load = async () => {
      try {
        const client = getClientForEnvironment();
        if (userId) {
          const notifs = await listNotifications(userId, {}, client);
          setNotifications(notifs);
        }
        const cl = await getProjectChangelog(projectId, 100, client);
        const grouped: Record<string, ChangeDay['changes']> = {};
        cl.forEach((e: any) => {
          const day = new Date(e.timestamp).toDateString();
          (grouped[day] ||= []).push({
            id: e.id,
            title: `${e.target} ${e.action}`,
            description: e.description,
            author: e.userId || 'system',
            timestamp: new Date(e.timestamp).toLocaleTimeString(),
          });
        });
        setChanges(
          Object.keys(grouped).map((date) => ({
            date,
            changes: grouped[date],
          }))
        );
      } catch (e) {
        console.error('Failed to load activity', e);
      }
    };
    void load();
  }, [open, projectId, userId]);

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id, true, getClientForEnvironment());
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (e) {
      console.error('Mark read failed', e);
    }
  };

  return (
    <TabsContent value="activity" className="flex-1 min-h-0 mt-3">
      <ScrollArea className="h-full">
        <div className="px-4 pb-6 space-y-5">
          {/* Notifications */}
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Notifications
            </h3>
            {notifications.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nothing new — mentions will show up here.
              </p>
            )}
            {notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => !n.read && handleMarkRead(n.id)}
                className="w-full text-left flex items-start gap-2 rounded-lg border p-2.5 hover:bg-accent/50 transition-colors"
              >
                {!n.read && (
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                )}
                <div className={n.read ? 'opacity-60' : ''}>
                  <div className="text-sm font-medium">{n.title || n.type}</div>
                  {n.description && (
                    <div className="text-xs text-muted-foreground">
                      {n.description}
                    </div>
                  )}
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {new Date(n.created_at).toLocaleString()}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <Separator />

          {/* Checkpoints + changelog */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Checkpoints
              </h3>
              {projectId && (
                <VersionHistoryButton
                  canvasId={projectId}
                  variant="outline"
                  size="sm"
                />
              )}
            </div>
            {changes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No changes recorded yet.
              </p>
            ) : (
              changes.map((day) => (
                <div key={day.date} className="space-y-2">
                  <h4 className="text-xs font-medium text-foreground">
                    {day.date}
                  </h4>
                  <div className="space-y-1.5 pl-2">
                    {day.changes.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <div>
                          <span className="font-medium">{c.title}</span>{' '}
                          <span className="text-xs text-muted-foreground">
                            {c.timestamp}
                          </span>
                          {c.description && (
                            <div className="text-xs text-muted-foreground">
                              {c.description}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </ScrollArea>
    </TabsContent>
  );
}

export default CollaborationPanel;
