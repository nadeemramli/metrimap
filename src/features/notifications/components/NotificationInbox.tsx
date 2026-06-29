import { useAppStore } from '@/lib/stores';
import { Button } from '@/shared/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import {
  getUnreadNotificationCount,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationRow,
} from '@/shared/lib/supabase/services/collaboration';
import { cn } from '@/shared/utils';
import { Bell, Check, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type TypeFilter = 'all' | 'mention' | 'assigned';
type RecencyFilter = 0 | 3 | 7;

const TYPE_TABS: { id: TypeFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'mention', label: 'Mentioned' },
  { id: 'assigned', label: 'Assigned to me' },
];
const RECENCY_TABS: { id: RecencyFilter; label: string }[] = [
  { id: 0, label: 'Any time' },
  { id: 3, label: '3 days' },
  { id: 7, label: '7 days' },
];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function NotificationInbox() {
  const client = useClerkSupabase();
  const user = useAppStore((s) => s.user);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [unread, setUnread] = useState(0);
  const [busy, setBusy] = useState(false);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [recency, setRecency] = useState<RecencyFilter>(0);

  const userId = user?.id;

  const refreshCount = useCallback(async () => {
    if (!client || !userId) return;
    try {
      setUnread(await getUnreadNotificationCount(userId, client));
    } catch {
      /* badge is best-effort */
    }
  }, [client, userId]);

  // Badge count on mount.
  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  const load = useCallback(async () => {
    if (!client || !userId) return;
    setBusy(true);
    try {
      const data = await listNotifications(
        userId,
        {
          types: typeFilter === 'all' ? undefined : [typeFilter],
          sinceDays: recency || undefined,
        },
        client
      );
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setBusy(false);
    }
  }, [client, userId, typeFilter, recency]);

  // (Re)load the list when opened or filters change.
  useEffect(() => {
    if (open) load();
  }, [open, load]);

  // Live badge: bump on new notifications for this user (refs avoid resubscribe).
  const openRef = useRef(open);
  openRef.current = open;
  const loadRef = useRef(load);
  loadRef.current = load;
  useEffect(() => {
    if (!client || !userId) return;
    const channel = client
      .channel(`notif-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          setUnread((c) => c + 1);
          if (openRef.current) loadRef.current();
        }
      )
      .subscribe();
    return () => {
      void client.removeChannel(channel);
    };
  }, [client, userId]);

  const handleOpen = async (n: NotificationRow) => {
    if (!n.read && client) {
      try {
        await markNotificationRead(n.id, true, client);
        setItems((prev) =>
          prev.map((x) => (x.id === n.id ? { ...x, read: true } : x))
        );
        setUnread((c) => Math.max(0, c - 1));
      } catch {
        /* ignore */
      }
    }
    const projectId = (n.metadata as any)?.projectId;
    if (projectId) {
      setOpen(false);
      navigate(`/canvas/${projectId}`);
    }
  };

  const handleMarkAll = async () => {
    if (!client || !userId) return;
    await markAllNotificationsRead(userId, client);
    setItems((prev) => prev.map((x) => ({ ...x, read: true })));
    setUnread(0);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 p-0"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="text-sm font-semibold">Notifications</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs"
            onClick={handleMarkAll}
            disabled={unread === 0}
          >
            <Check className="h-3.5 w-3.5" />
            Mark all read
          </Button>
        </div>

        <div className="flex flex-col gap-1.5 border-b px-3 py-2">
          <div className="flex gap-1">
            {TYPE_TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTypeFilter(t.id)}
                className={cn(
                  'rounded-md px-2 py-1 text-xs transition-colors',
                  typeFilter === t.id
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {RECENCY_TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setRecency(t.id)}
                className={cn(
                  'rounded-md px-2 py-0.5 text-[11px] transition-colors',
                  recency === t.id
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-80 overflow-auto">
          {busy ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Nothing here{typeFilter !== 'all' ? ' for this filter' : ' yet'}.
            </p>
          ) : (
            items.map((n) => (
              <button
                key={n.id}
                onClick={() => handleOpen(n)}
                className={cn(
                  'flex w-full items-start gap-2 border-b px-3 py-2.5 text-left transition-colors hover:bg-muted/60',
                  !n.read && 'bg-primary/5'
                )}
              >
                {!n.read && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                )}
                <span className={cn('min-w-0 flex-1', n.read && 'pl-4')}>
                  <span className="block truncate text-sm font-medium">
                    {n.title || n.type}
                  </span>
                  {n.description && (
                    <span className="block truncate text-xs text-muted-foreground">
                      {n.description}
                    </span>
                  )}
                  <span className="mt-0.5 block text-[11px] text-muted-foreground/70">
                    {timeAgo(n.created_at)}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
