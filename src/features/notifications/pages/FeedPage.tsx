import { useAppStore } from '@/lib/stores';
import { Button } from '@/shared/components/ui/button';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import {
  listNotifications,
  type NotificationRow,
} from '@/shared/lib/supabase/services/collaboration';
import {
  getWorkspaceChangelog,
  type ChangelogEntry,
} from '@/shared/lib/supabase/services/changelog';
import {
  addFeedBookmark,
  listFeedBookmarks,
  removeFeedBookmark,
} from '@/shared/lib/supabase/services/feedBookmarks';
import { cn } from '@/shared/utils';
import {
  ArrowLeft,
  AtSign,
  Bookmark,
  Loader2,
  Settings2,
  TriangleAlert,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// The Monday-style update feed: people-events (mentions/comments — from
// notifications) and system/data-events (created/updated/analysis — from
// changelog) merged into one time-ordered board. See PRD #7.
type FeedFilter = 'all' | 'mentioned' | 'alerts' | 'bookmarked';

interface FeedItem {
  id: string;
  kind: 'people' | 'system';
  isMention: boolean;
  isAlert: boolean;
  title: string;
  description?: string;
  timestamp: string;
  projectId?: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function FeedPage() {
  const client = useClerkSupabase();
  const user = useAppStore((s) => s.user);
  const navigate = useNavigate();

  const [items, setItems] = useState<FeedItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<FeedFilter>('all');
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    if (!client || !user?.id) return;
    setBusy(true);
    try {
      const [changelog, notifications] = await Promise.all([
        getWorkspaceChangelog(100, client) as Promise<ChangelogEntry[]>,
        listNotifications(user.id, {}, client) as Promise<NotificationRow[]>,
      ]);
      const sys: FeedItem[] = changelog.map((c) => ({
        id: `c:${c.id}`,
        kind: 'system',
        isMention: false,
        isAlert: false,
        title: `${c.action} · ${c.targetName}`,
        description: c.description,
        timestamp: c.timestamp,
        projectId: c.projectId,
      }));
      const ppl: FeedItem[] = notifications.map((n) => ({
        id: `n:${n.id}`,
        kind: 'people',
        isMention: n.type === 'mention',
        isAlert: n.type === 'alert',
        title: n.title || n.type,
        description: n.description ?? undefined,
        timestamp: n.created_at,
        projectId: (n.metadata as any)?.projectId ?? (n.metadata as any)?.cardId,
      }));
      setItems(
        [...sys, ...ppl].sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
      );
    } catch {
      setItems([]);
    } finally {
      setBusy(false);
    }
  }, [client, user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  // Load persistent bookmarks (DB-backed, follow the user across devices).
  useEffect(() => {
    if (!client) return;
    let active = true;
    listFeedBookmarks(client)
      .then((keys) => active && setBookmarks(new Set(keys)))
      .catch((e) => console.error('Failed to load feed bookmarks', e));
    return () => {
      active = false;
    };
  }, [client]);

  // Live feed: reload when a new notification arrives for me (mentions etc.).
  useEffect(() => {
    if (!client || !user?.id) return;
    const channel = client
      .channel(`feed-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => void load()
      )
      .subscribe();
    return () => {
      void client.removeChannel(channel);
    };
  }, [client, user?.id, load]);

  const toggleBookmark = (id: string) => {
    const isBookmarked = bookmarks.has(id);
    // Optimistic; revert on failure.
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (isBookmarked) next.delete(id);
      else next.add(id);
      return next;
    });
    const op = isBookmarked
      ? removeFeedBookmark(id, client ?? undefined)
      : addFeedBookmark(id, client ?? undefined);
    void op.catch((e) => {
      console.error('Failed to toggle bookmark', e);
      setBookmarks((prev) => {
        const next = new Set(prev);
        if (isBookmarked) next.add(id);
        else next.delete(id);
        return next;
      });
    });
  };

  const filtered = items.filter((i) => {
    if (filter === 'mentioned') return i.isMention;
    if (filter === 'alerts') return i.isAlert;
    if (filter === 'bookmarked') return bookmarks.has(i.id);
    return true;
  });

  const TABS: { id: FeedFilter; label: string }[] = [
    { id: 'all', label: 'All activity' },
    { id: 'mentioned', label: 'Mentioned me' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'bookmarked', label: 'Bookmarked' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-6 py-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Home
          </Button>
          <h1 className="text-xl font-bold">Activity</h1>
          {busy && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-6">
        <div className="mb-5 flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={cn(
                'rounded-md border px-3 py-1.5 text-sm transition-colors',
                filter === t.id
                  ? 'border-secondary bg-secondary text-secondary-foreground'
                  : 'border-border text-muted-foreground hover:bg-muted'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 && !busy ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            {filter === 'bookmarked'
              ? 'No bookmarked items yet.'
              : 'No activity yet — it shows up as your team builds and comments.'}
          </p>
        ) : (
          <div className="space-y-1">
            {filtered.map((i) => (
              <div
                key={i.id}
                className="group flex items-start gap-3 rounded-md border border-transparent px-3 py-2.5 hover:border-border hover:bg-muted/40"
              >
                <span
                  className={cn(
                    'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                    i.isAlert
                      ? 'bg-amber-100 text-amber-600'
                      : i.kind === 'people'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-muted text-muted-foreground'
                  )}
                  title={
                    i.isAlert
                      ? 'Alert'
                      : i.kind === 'people'
                        ? 'People event'
                        : 'System event'
                  }
                >
                  {i.isAlert ? (
                    <TriangleAlert className="h-4 w-4" />
                  ) : i.isMention ? (
                    <AtSign className="h-4 w-4" />
                  ) : (
                    <Settings2 className="h-4 w-4" />
                  )}
                </span>
                <button
                  onClick={() =>
                    i.projectId && navigate(`/canvas/${i.projectId}`)
                  }
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="block truncate text-sm font-medium capitalize">
                    {i.title}
                  </span>
                  {i.description && (
                    <span className="block truncate text-xs text-muted-foreground">
                      {i.description}
                    </span>
                  )}
                  <span className="mt-0.5 block text-[11px] text-muted-foreground/70">
                    {timeAgo(i.timestamp)}
                  </span>
                </button>
                <button
                  onClick={() => toggleBookmark(i.id)}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                  title={bookmarks.has(i.id) ? 'Remove bookmark' : 'Bookmark'}
                >
                  <Bookmark
                    className={cn(
                      'h-4 w-4',
                      bookmarks.has(i.id)
                        ? 'fill-current text-primary'
                        : 'text-muted-foreground'
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
