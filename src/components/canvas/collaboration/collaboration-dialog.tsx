"use client";

import * as React from "react";
import {
  Bell,
  Calendar,
  MessageSquare,
  X,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Search,
  FileText,
  Network,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CommentSummaryDashboard } from "./comment-summary-dashboard";
import { useParams } from "react-router-dom";
import { useAppStore } from "@/lib/stores";
import {
  listCommentThreads,
  listComments,
  createComment,
  updateCommentThread,
  listNotifications,
} from "@/lib/supabase/services/collaboration";
import { getProjectChangelog } from "@/lib/supabase/services/changelog";
import { supabase } from "@/lib/supabase/client";

// Runtime data (loaded from Supabase)

interface CollaborationDialogProps {
  children: React.ReactNode;
}

export function CollaborationDialog({ children }: CollaborationDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("comments");
  const [selectedThread, setSelectedThread] = React.useState<string | null>(
    null
  );

  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [authorFilter, setAuthorFilter] = React.useState<string>("all");
  const [dateFilter, setDateFilter] = React.useState<string>("newest");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [sourceFilter, setSourceFilter] = React.useState<string>("all");

  const [threads, setThreads] = React.useState<any[]>([]);
  const [commentsByThread, setCommentsByThread] = React.useState<
    Record<string, any[]>
  >({});
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [changelogEntries, setChangelogEntries] = React.useState<any[]>([]);
  const { canvasId } = useParams();
  const user = useAppStore((s) => s.user);
  const [newComment, setNewComment] = React.useState<string>("");
  const unreadNotifications = notifications.filter((n: any) => !n.read).length;

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case "feature":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "improvement":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "fix":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get unique authors for filter dropdown
  const uniqueAuthors = React.useMemo(() => {
    const authors = new Set<string>();
    threads.forEach((thread: any) => {
      (commentsByThread[thread.id] || []).forEach((comment: any) => {
        if (comment.author_id) authors.add(comment.author_id);
      });
    });
    return Array.from(authors);
  }, [threads, commentsByThread]);

  // Filter and sort comment threads
  const filteredThreads = React.useMemo(() => {
    let filtered = threads.filter((thread: any) => {
      // Status filter
      const tComments = commentsByThread[thread.id] || [];
      if (statusFilter === "active" && tComments.every((c: any) => c.resolved))
        return false;
      if (
        statusFilter === "resolved" &&
        tComments.some((c: any) => !c.resolved)
      )
        return false;

      // Author filter
      if (
        authorFilter !== "all" &&
        !tComments.some((c: any) => c.author_id === authorFilter)
      )
        return false;

      // Source filter
      if (sourceFilter !== "all" && thread.source !== sourceFilter)
        return false;

      // Search query filter
      if (searchQuery) {
        const match = tComments.some((c: any) =>
          c.content?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (!match) return false;
      }

      return true;
    });

    // Sort by date
    if (dateFilter === "newest") {
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
    } else if (dateFilter === "oldest") {
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

  // Initial load when dialog opens
  React.useEffect(() => {
    const load = async () => {
      if (!open || !canvasId) return;
      try {
        const client = supabase();
        const t = (await listCommentThreads(canvasId, client)) as any[];
        setThreads(t || []);
        const byThread: Record<string, any[]> = {};
        for (const thr of t || []) {
          const c = (await listComments(thr.id, client)) as any[];
          byThread[thr.id] = c || [];
        }
        setCommentsByThread(byThread);

        const cl = (await getProjectChangelog(canvasId, 100, client)) as any[];
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
            author: e.userId || "system",
            timestamp: new Date(e.timestamp).toLocaleTimeString(),
          })),
        }));
        setChangelogEntries(groupedArr);

        if (user?.id) {
          const notifs = (await listNotifications(
            user.id,
            { unreadOnly: false },
            client
          )) as any[];
          setNotifications(notifs || []);
        }
      } catch (e) {
        console.error("Failed to load collaboration data", e);
      }
    };
    load();
  }, [open, canvasId, user?.id]);

  // Realtime subscriptions for threads and comments
  React.useEffect(() => {
    if (!open || !canvasId) return;
    const client = supabase();
    const threadsCh = client
      .channel(`rt:comment_threads:${canvasId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comment_threads" },
        (payload: any) => {
          const projectId = payload.new?.project_id ?? payload.old?.project_id;
          if (projectId !== canvasId) return;
          listCommentThreads(canvasId, client)
            .then(async (t: any[]) => {
              setThreads(t || []);
              const byThread: Record<string, any[]> = {};
              for (const thr of t || []) {
                const c = (await listComments(thr.id, client)) as any[];
                byThread[thr.id] = c || [];
              }
              setCommentsByThread(byThread);
            })
            .catch(() => {});
        }
      )
      .subscribe();

    const commentsCh = client
      .channel(`rt:comments:${canvasId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments" },
        (payload: any) => {
          const threadId = payload.new?.thread_id ?? payload.old?.thread_id;
          if (!threadId) return;
          listComments(threadId, client)
            .then((c) => {
              setCommentsByThread((prev) => ({ ...prev, [threadId]: c || [] }));
            })
            .catch(() => {});
        }
      )
      .subscribe();

    return () => {
      try {
        client.removeChannel(threadsCh);
      } catch {}
      try {
        client.removeChannel(commentsCh);
      } catch {}
    };
  }, [open, canvasId]);

  // Actions
  const handlePostComment = async () => {
    if (!selectedThread || !newComment.trim()) return;
    try {
      const client = supabase();
      const added = await createComment(
        {
          threadId: selectedThread,
          authorId: user?.id ?? null,
          content: newComment.trim(),
        },
        client
      );
      setCommentsByThread((prev) => ({
        ...prev,
        [selectedThread]: [...(prev[selectedThread] || []), added],
      }));
      setNewComment("");
    } catch (e) {
      console.error("Failed to post comment", e);
    }
  };

  const handleResolveThread = async () => {
    if (!selectedThread) return;
    try {
      const client = supabase();
      await updateCommentThread(
        selectedThread,
        { is_resolved: true } as any,
        client
      );
      setThreads((prev) =>
        prev.map((t: any) =>
          t.id === selectedThread ? { ...t, is_resolved: true } : t
        )
      );
    } catch (e) {
      console.error("Failed to resolve thread", e);
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
    window.dispatchEvent(new CustomEvent("collab:navigate", { detail }));
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
                  <X className="h-4 w-4" />
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
                  <MessageSquare className="h-4 w-4" />
                  Comments
                </TabsTrigger>
                <TabsTrigger value="notifications" className="gap-2 relative">
                  <Bell className="h-4 w-4" />
                  Alerts
                  {unreadNotifications > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs"
                    >
                      {unreadNotifications}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="changelog" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Changes
                </TabsTrigger>
              </TabsList>

              <div className="px-4 pb-4 h-full">
                <TabsContent value="comments" className="mt-0 h-full">
                  <div className="space-y-4 h-full flex flex-col">
                    {/* Summary Dashboard */}
                    <CommentSummaryDashboard
                      threads={threads.map((t: any) => ({
                        ...t,
                        sourceIcon:
                          t.source === "canvas"
                            ? MessageSquare
                            : t.source === "evidence"
                              ? FileText
                              : Network,
                        comments: commentsByThread[t.id] || [],
                      }))}
                      onSourceFilter={setSourceFilter}
                      activeSourceFilter={sourceFilter}
                    />

                    <Separator />

                    {/* Search Bar */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search comments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>

                    {/* Filter Controls */}
                    <div className="flex gap-2 flex-wrap">
                      {/* Status Filter */}
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Author Filter */}
                      <Select
                        value={authorFilter}
                        onValueChange={setAuthorFilter}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Author" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Authors</SelectItem>
                          {uniqueAuthors.map((author) => (
                            <SelectItem key={author} value={author}>
                              {author}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Source Filter */}
                      <Select
                        value={sourceFilter}
                        onValueChange={setSourceFilter}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Sources</SelectItem>
                          <SelectItem value="canvas">Canvas</SelectItem>
                          <SelectItem value="evidence">
                            Evidence Editor
                          </SelectItem>
                          <SelectItem value="node">Node Sheet</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Date Sort */}
                      <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest</SelectItem>
                          <SelectItem value="oldest">Oldest</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Clear Filters */}
                      {(statusFilter !== "all" ||
                        authorFilter !== "all" ||
                        sourceFilter !== "all" ||
                        searchQuery ||
                        dateFilter !== "newest") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setStatusFilter("all");
                            setAuthorFilter("all");
                            setSourceFilter("all");
                            setDateFilter("newest");
                            setSearchQuery("");
                          }}
                          className="text-muted-foreground"
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>

                    {/* Results Summary */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        {filteredThreads.length} of {threads.length} thread
                        {filteredThreads.length !== 1 ? "s" : ""}
                        {searchQuery && ` matching "${searchQuery}"`}
                      </span>
                      {filteredThreads.length > 0 && (
                        <span>
                          {filteredThreads.reduce(
                            (acc: number, thread: any) =>
                              acc +
                              ((commentsByThread as any)[thread.id]?.length ||
                                0),
                            0
                          )}{" "}
                          total comments
                        </span>
                      )}
                    </div>

                    {/* Comment Threads List */}
                    <ScrollArea className="flex-1">
                      <div className="space-y-4">
                        {filteredThreads.length === 0 ? (
                          <div className="text-center py-8">
                            <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                              {searchQuery ||
                              statusFilter !== "all" ||
                              authorFilter !== "all" ||
                              sourceFilter !== "all"
                                ? "No comments match your filters"
                                : "No comment threads found"}
                            </p>
                          </div>
                        ) : (
                          filteredThreads.map((thread: any) => {
                            const tComments =
                              (commentsByThread as any)[thread.id] || [];
                            const isResolved = tComments.every(
                              (c: any) => c.resolved
                            );
                            const latestComment =
                              tComments[tComments.length - 1];

                            return (
                              <div
                                key={thread.id}
                                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                  selectedThread === thread.id
                                    ? "bg-primary/10 border-primary"
                                    : "hover:bg-muted/50"
                                }`}
                                onClick={() => setSelectedThread(thread.id)}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    {thread.source === "canvas" ? (
                                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                    ) : thread.source === "evidence" ? (
                                      <FileText className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                      <Network className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <span className="font-medium text-sm">
                                      {thread?.context?.title || thread?.source}
                                    </span>
                                    {isResolved ? (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs bg-green-100 text-green-700"
                                      >
                                        Resolved
                                      </Badge>
                                    ) : (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs bg-blue-100 text-blue-700"
                                      >
                                        Active
                                      </Badge>
                                    )}
                                  </div>
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </div>

                                {/* Add context information */}
                                <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                  <span className="capitalize">
                                    {thread.source}
                                  </span>
                                  {thread?.context && (
                                    <>
                                      <span>•</span>
                                      <span>
                                        {typeof thread?.context === "string"
                                          ? thread?.context
                                          : thread?.context?.summary || ""}
                                      </span>
                                    </>
                                  )}
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                  {latestComment?.content}
                                </p>

                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <span>
                                      {tComments.length} comment
                                      {tComments.length !== 1 ? "s" : ""}
                                    </span>
                                    <span>•</span>
                                    <span>
                                      by {latestComment?.author_id || ""}
                                    </span>
                                  </div>
                                  <span>
                                    {latestComment?.created_at
                                      ? new Date(
                                          latestComment.created_at
                                        ).toLocaleTimeString()
                                      : ""}
                                  </span>
                                </div>

                                {/* Show matching search terms */}
                                {searchQuery && (
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {tComments
                                      .filter((c: any) =>
                                        c.content
                                          ?.toLowerCase()
                                          .includes(searchQuery.toLowerCase())
                                      )
                                      .slice(0, 2)
                                      .map((_comment: any, idx: number) => (
                                        <Badge
                                          key={idx}
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          Match in comment
                                        </Badge>
                                      ))}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>

                <TabsContent value="notifications" className="mt-0 h-full">
                  <ScrollArea className="h-full">
                    <div className="space-y-4">
                      <h3 className="font-medium text-sm text-muted-foreground">
                        Recent Notifications
                      </h3>
                      {notifications.map((notification: any) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg border ${
                            !notification.read
                              ? "bg-blue-50 border-blue-200"
                              : "bg-muted/20"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Bell className="h-4 w-4 mt-1 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">
                                {notification.title}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.description}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                {new Date(
                                  notification.created_at
                                ).toLocaleString()}
                              </span>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="changelog" className="mt-0 h-full">
                  <ScrollArea className="h-full">
                    <div className="space-y-6">
                      <h3 className="font-medium text-sm text-muted-foreground">
                        Recent Changes
                      </h3>
                      {changelogEntries.map((entry: any, index: number) => (
                        <div key={index}>
                          <h4 className="font-medium text-sm mb-3">
                            {entry.date}
                          </h4>
                          <div className="space-y-3">
                            {entry.changes.map((change: any) => (
                              <div
                                key={change.id}
                                className="flex items-start gap-3 p-3 rounded-lg bg-muted/20"
                              >
                                {getChangeTypeIcon(change.type)}
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm">
                                    {change.title}
                                  </p>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {change.description}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs text-muted-foreground">
                                      {change.author}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      •
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {change.timestamp}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {index < changelogEntries.length - 1 && (
                            <Separator className="mt-6" />
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {selectedThread ? (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {threads.find((t: any) => t.id === selectedThread)
                          ?.context?.title ||
                          threads.find((t: any) => t.id === selectedThread)
                            ?.source}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Comment Thread
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNavigateToCanvas}
                      >
                        Navigate to Canvas
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResolveThread}
                      >
                        Resolve Thread
                      </Button>
                    </div>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {(commentsByThread[selectedThread!] || []).map(
                      (comment: any) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={"/placeholder.svg"} />
                            <AvatarFallback>
                              {comment.author_id?.slice(0, 2) || ""}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">
                                {comment.author_id || ""}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.created_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Add a comment..."
                        className="min-h-[80px]"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">
                          Posting as {user?.id || "guest"}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleResolveThread}
                          >
                            Resolve Thread
                          </Button>
                          <Button
                            size="sm"
                            onClick={handlePostComment}
                            disabled={!newComment.trim()}
                          >
                            Post Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Select a comment thread</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a comment thread from the sidebar to view and manage
                    discussions
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
