import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import {
  createEvent,
  deleteEvent,
  deleteProperty,
  listEvents,
  listProperties,
  updateEvent,
  upsertProperty,
  type EventDefinition,
  type EventLifecycle,
  type EventProperty,
  type EventPropertyType,
} from '@/shared/lib/supabase/services/eventTaxonomy';
import { Loader2, Plus, Tags, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const LIFECYCLE_VARIANT: Record<
  EventLifecycle,
  'secondary' | 'default' | 'outline'
> = {
  proposed: 'secondary',
  approved: 'default',
  deprecated: 'outline',
};

const PROPERTY_TYPES: EventPropertyType[] = [
  'string',
  'number',
  'boolean',
  'timestamp',
  'enum',
];

// Derive a snake_case key from a human name (e.g. "Signup Completed" → signup_completed).
function toKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function EventsTaxonomyPanel() {
  const client = useClerkSupabase();
  const [events, setEvents] = useState<EventDefinition[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('');

  // Properties side sheet
  const [activeEvent, setActiveEvent] = useState<EventDefinition | null>(null);
  const [properties, setProperties] = useState<EventProperty[]>([]);
  const [propsBusy, setPropsBusy] = useState(false);
  const [newPropName, setNewPropName] = useState('');
  const [newPropType, setNewPropType] = useState<EventPropertyType>('string');

  const load = async () => {
    if (!client) return;
    setBusy(true);
    setError(null);
    try {
      setEvents(await listEvents(client));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load events.');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (client) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const addEvent = async () => {
    if (!client || !newName.trim()) return;
    try {
      const created = await createEvent(
        {
          name: newName.trim(),
          key: toKey(newName),
          category: newCategory.trim() || null,
        },
        client
      );
      setEvents((prev) => [created, ...prev]);
      setNewName('');
      setNewCategory('');
      setAddOpen(false);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : 'Failed to create event'
      );
    }
  };

  const cycleLifecycle = async (ev: EventDefinition) => {
    if (!client) return;
    const order: EventLifecycle[] = ['proposed', 'approved', 'deprecated'];
    const next = order[(order.indexOf(ev.lifecycle_state) + 1) % order.length];
    try {
      await updateEvent(ev.id, { lifecycle_state: next }, client);
      setEvents((prev) =>
        prev.map((e) =>
          e.id === ev.id ? { ...e, lifecycle_state: next } : e
        )
      );
    } catch {
      toast.error('Failed to update lifecycle');
    }
  };

  const removeEvent = async (id: string) => {
    if (!client) return;
    try {
      await deleteEvent(id, client);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch {
      toast.error('Failed to delete event');
    }
  };

  const openProperties = async (ev: EventDefinition) => {
    setActiveEvent(ev);
    setProperties([]);
    if (!client) return;
    setPropsBusy(true);
    try {
      setProperties(await listProperties(ev.id, client));
    } catch {
      setProperties([]);
    } finally {
      setPropsBusy(false);
    }
  };

  const addProperty = async () => {
    if (!client || !activeEvent || !newPropName.trim()) return;
    try {
      const prop = await upsertProperty(
        {
          event_id: activeEvent.id,
          name: newPropName.trim(),
          key: toKey(newPropName),
          data_type: newPropType,
        },
        client
      );
      setProperties((prev) => [...prev, prop]);
      setNewPropName('');
      setNewPropType('string');
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : 'Failed to add property'
      );
    }
  };

  const removeProperty = async (id: string) => {
    if (!client) return;
    try {
      await deleteProperty(id, client);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch {
      toast.error('Failed to remove property');
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          A governed dictionary of the events your product emits and the
          properties they carry. Catalog-only for now.
        </p>
        <Button size="sm" onClick={() => setAddOpen(true)} className="gap-1.5">
          <Plus className="h-4 w-4" />
          New event
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive mb-4" role="alert">
          {error}
        </p>
      )}

      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : events.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Tags className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">
            No events defined yet. Add one to start your taxonomy.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {events.map((ev) => (
            <Card key={ev.id}>
              <CardContent className="py-3 flex items-center justify-between gap-4">
                <button
                  className="min-w-0 text-left"
                  onClick={() => openProperties(ev)}
                  title="Edit properties"
                >
                  <div className="font-medium truncate flex items-center gap-2">
                    {ev.name}
                    <code className="text-xs font-normal text-muted-foreground">
                      {ev.key}
                    </code>
                  </div>
                  {ev.category && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {ev.category}
                    </div>
                  )}
                </button>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => cycleLifecycle(ev)} title="Cycle lifecycle">
                    <Badge variant={LIFECYCLE_VARIANT[ev.lifecycle_state]}>
                      {ev.lifecycle_state}
                    </Badge>
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEvent(ev.id)}
                    title="Delete event"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add event dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New event</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Event name (e.g. Signup Completed)"
            />
            {newName.trim() && (
              <p className="text-xs text-muted-foreground">
                key: <code>{toKey(newName)}</code>
              </p>
            )}
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category (optional)"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addEvent} disabled={!newName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Properties side sheet */}
      <Sheet
        open={!!activeEvent}
        onOpenChange={(open) => !open && setActiveEvent(null)}
      >
        <SheetContent className="w-[420px] sm:max-w-[420px]">
          <SheetHeader>
            <SheetTitle>{activeEvent?.name} — properties</SheetTitle>
          </SheetHeader>

          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2">
              <Input
                value={newPropName}
                onChange={(e) => setNewPropName(e.target.value)}
                placeholder="Property name"
                className="flex-1"
              />
              <Select
                value={newPropType}
                onValueChange={(v) => setNewPropType(v as EventPropertyType)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={addProperty}
                disabled={!newPropName.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {propsBusy ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : properties.length === 0 ? (
              <p className="text-sm text-muted-foreground/70 py-4">
                No properties yet.
              </p>
            ) : (
              <div className="space-y-2">
                {properties.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate flex items-center gap-2">
                        {p.name}
                        <code className="text-xs font-normal text-muted-foreground">
                          {p.key}
                        </code>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {p.data_type}
                        {p.required ? ' · required' : ''}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProperty(p.id)}
                      title="Remove property"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
