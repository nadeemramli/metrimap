import VersionHistoryButton from '@/features/canvas/components/version-history/VersionHistoryButton';
import { useAppStore } from '@/lib/stores';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Separator } from '@/shared/components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { createClerkSupabaseClient } from '@/shared/lib/supabase/client';
import { getProjectChangelog } from '@/shared/lib/supabase/services/changelog';
import {
  createComment,
  listCommentThreads,
  listComments,
  listNotifications,
  updateCommentThread,
} from '@/shared/lib/supabase/services/collaboration';
import { AlertCircle, CheckCircle, Clock, Info } from 'lucide-react';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { CommentSummaryDashboard } from './CommentSummaryDashboard';

interface CollaborationDialogProps {
  children: React.ReactNode;
}

export function CollaborationDialog({ children }: CollaborationDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('comments');
  const [selectedThread, setSelectedThread] = React.useState<string | null>(
    null
  );
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [authorFilter, setAuthorFilter] = React.useState<string>('all');
  const [dateFilter, setDateFilter] = React.useState<string>('newest');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [sourceFilter, setSourceFilter] = React.useState<string>('all');

  const [threads, setThreads] = React.useState<any[]>([]);
  const [commentsByThread, setCommentsByThread] = React.useState<
    Record<string, any[]>
  >({});
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [changelogEntries, setChangelogEntries] = React.useState<any[]>([]);
  const { canvasId } = useParams();
  const user = useAppStore((s) => s.user);
  const [newComment, setNewComment] = React.useState<string>('');
  const unreadNotifications = notifications.filter((n: any) => !n.read).length;

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case 'feature':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'improvement':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'fix':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const uniqueAuthors = React.useMemo(() => {
    const authors = new Set<string>();
    threads.forEach((thread: any) => {
      (commentsByThread[thread.id] || []).forEach((comment: any) => {
        if (comment.author_id) authors.add(comment.author_id);
      });
    });
    return Array.from(authors);
  }, [threads, commentsByThread]);

  const filteredThreads = React.useMemo(() => {
    let filtered = threads.filter((thread: any) => {
      const tComments = commentsByThread[thread.id] || [];
      if (statusFilter === 'active' && tComments.every((c: any) => c.resolved))
        return false;
      if (
        statusFilter === 'resolved' &&
        tComments.some((c: any) => !c.resolved)
      )
        return false;
      if (
        authorFilter !== 'all' &&
        !tComments.some((c: any) => c.author_id === authorFilter)
      )
        return false;
      if (sourceFilter !== 'all' && thread.source !== sourceFilter)
        return false;
      if (searchQuery) {
        const match = tComments.some((c: any) =>
          c.content?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (!match) return false;
      }
      return true;
    });

    if (dateFilter === 'newest') {
      filtered.sort((a, b) => {
        const aLatest = Math.max(
          ...((commentsByThread[a.id] || []) as any[]).map(
            (c: any) => new Date(c.created_at).getTime() || 0
          )
        );
        const bLatest = Math.max(
          ...((commentsByThread[b.id] || []) as any[]).map(
            (c: any) => new Date(c.created_at).getTime() || 0
          )
        );
        return bLatest - aLatest;
      });
    } else if (dateFilter === 'oldest') {
      filtered.sort((a, b) => {
        const aEarliest = Math.min(
          ...((commentsByThread[a.id] || []) as any[]).map(
            (c: any) => new Date(c.created_at).getTime() || Date.now()
          )
        );
        const bEarliest = Math.min(
          ...((commentsByThread[b.id] || []) as any[]).map(
            (c: any) => new Date(c.created_at).getTime() || Date.now()
          )
        );
        return aEarliest - bEarliest;
      });
    }
    return filtered;
  }, [
    threads,
    commentsByThread,
    statusFilter,
    authorFilter,
    sourceFilter,
    dateFilter,
    searchQuery,
  ]);

  React.useEffect(() => {
    const load = async () => {
      if (!open || !canvasId) return;
      try {
        const client = createClerkSupabaseClient();
        const t = (await listCommentThreads(canvasId, client as any)) as any[];
        setThreads(t || []);
        const byThread: Record<string, any[]> = {};
        for (const thr of t || []) {
          const c = (await listComments(thr.id, client as any)) as any[];
          byThread[thr.id] = c || [];
        }
        setCommentsByThread(byThread);

        const cl = (await getProjectChangelog(
          canvasId,
          100,
          client as any
        )) as any[];
        const grouped: Record<string, any[]> = {};
        cl.forEach((entry: any) => {
          const day = new Date(entry.timestamp).toDateString();
          grouped[day] = grouped[day] || [];
          grouped[day].push(entry);
        });
        const groupedArr = Object.keys(grouped).map((date) => ({
          date,
          changes: grouped[date].map((e: any) => ({
            id: e.id,
            type: e.action,
            title: `${e.target} ${e.action}`,
            description: e.description,
            author: e.userId || 'system',
            timestamp: new Date(e.timestamp).toLocaleTimeString(),
          })),
        }));
        setChangelogEntries(groupedArr);

        if (user?.id) {
          const notifs = (await listNotifications(
            user.id,
            { unreadOnly: false },
            client as any
          )) as any[];
          setNotifications(notifs || []);
        }
      } catch (e) {
        console.error('Failed to load collaboration data', e);
      }
    };
    load();
  }, [open, canvasId, user?.id]);

  React.useEffect(() => {
    if (!open || !canvasId) return;
    const client = createClerkSupabaseClient();
    const noop = () => {};
    // TODO: re-add realtime subscriptions using client when ready
    return () => noop();
  }, [open, canvasId]);

  const handlePostComment = async () => {
    if (!selectedThread || !newComment.trim()) return;
    try {
      const client = createClerkSupabaseClient();
      const added = await createComment(
        {
          threadId: selectedThread,
          authorId: user?.id ?? null,
          content: newComment.trim(),
        } as any,
        client as any
      );
      setCommentsByThread((prev) => ({
        ...prev,
        [selectedThread]: [...(prev[selectedThread] || []), added],
      }));
      setNewComment('');
    } catch (e) {
      console.error('Failed to post comment', e);
    }
  };

  const handleResolveThread = async () => {
    if (!selectedThread) return;
    try {
      const client = createClerkSupabaseClient();
      await updateCommentThread(
        selectedThread,
        { is_resolved: true } as any,
        client as any
      );
      setThreads((prev) =>
        prev.map((t: any) =>
          t.id === selectedThread ? { ...t, is_resolved: true } : t
        )
      );
    } catch (e) {
      console.error('Failed to resolve thread', e);
    }
  };

  const handleNavigateToCanvas = () => {
    if (!selectedThread) return;
    const thr = threads.find((t: any) => t.id === selectedThread);
    if (!thr) return;
    const detail = {
      threadId: thr.id,
      context: thr.context,
      source: thr.source,
    };
    window.dispatchEvent(new CustomEvent('collab:navigate', { detail }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[98vw] sm:max-w-[98vw] lg:max-w-[98vw] xl:max-w-[98vw] h-[95vh] p-0">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="basis-[30%] max-w-[30%] min-w-[320px] border-r bg-muted/20">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Collaboration Hub</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpen(false)}
                >
                  X
                </Button>
              </div>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="h-full"
            >
              <TabsList className="grid w-full grid-cols-3 m-4">
                <TabsTrigger value="comments" className="gap-2">
                  Comments
                </TabsTrigger>
                <TabsTrigger value="notifications" className="gap-2 relative">
                  Alerts
                </TabsTrigger>
                <TabsTrigger value="changelog" className="gap-2">
                  Changes
                </TabsTrigger>
              </TabsList>

              <div className="px-4 pb-4 h-full">
                <TabsContent value="comments" className="mt-0 h-full">
                  <CommentSummaryDashboard
                    threads={threads.map((t: any) => ({
                      ...t,
                      comments: commentsByThread[t.id] || [],
                    }))}
                    onSourceFilter={setSourceFilter}
                    activeSourceFilter={sourceFilter}
                  />
                  <Separator className="my-4" />
                  <div className="relative">
                    <Input
                      placeholder="Search comments..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {threads.length} threads • {totalComments(commentsByThread)}{' '}
                    comments
                  </div>
                  <ScrollArea className="flex-1 h-[50vh] mt-4">
                    <div className="space-y-4">
                      {/* Placeholder for thread list; can be filled similarly to legacy if needed */}
                      {threads.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No threads
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="notifications" className="mt-0 h-full">
                  <ScrollArea className="h-full">
                    <div className="space-y-4 text-sm text-muted-foreground">
                      No notifications
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="changelog" className="mt-0 h-full">
                  <div className="space-y-4">
                    {/* Version History Controls */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          Version History
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Manage canvas snapshots and version history
                        </p>
                      </div>
                      {canvasId && (
                        <VersionHistoryButton
                          canvasId={canvasId}
                          variant="default"
                          size="default"
                        />
                      )}
                    </div>

                    <Separator />

                    {/* Changelog Content */}
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-6 text-sm text-muted-foreground">
                        {changelogEntries.length === 0 ? (
                          <div className="text-center py-8">
                            <p>No changes recorded yet.</p>
                            <p className="text-xs mt-2">
                              Changes will appear here as you modify the canvas.
                            </p>
                          </div>
                        ) : (
                          changelogEntries.map((dayGroup, index) => (
                            <div key={index} className="space-y-3">
                              <h4 className="font-medium text-foreground sticky top-0 bg-background py-2">
                                {dayGroup.date}
                              </h4>
                              <div className="space-y-2 pl-4">
                                {dayGroup.changes.map((change) => (
                                  <div
                                    key={change.id}
                                    className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                                  >
                                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-foreground">
                                          {change.title}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {change.timestamp}
                                        </span>
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        {change.description}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        by {change.author}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Main Content Area placeholder */}
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a comment thread
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function totalComments(byThread: Record<string, any[]>) {
  return Object.values(byThread).reduce(
    (acc, arr) => acc + (arr?.length || 0),
    0
  );
}

export default CollaborationDialog;
