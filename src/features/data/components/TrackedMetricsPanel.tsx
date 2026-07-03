import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import { useCanvasStore } from '@/features/canvas/stores/useCanvasStore';
import { Input } from '@/shared/components/ui/input';
import {
  deleteTrackedMetric,
  getMetricUsage,
  listCandidateCards,
  listTrackedMetrics,
  promoteCardToTrackedMetric,
  updateTrackedMetric,
  type CandidateCard,
  type MetricUsage,
  type TrackedMetric,
} from '@/shared/lib/supabase/services/trackedMetrics';
import {
  Check,
  ChevronDown,
  ChevronRight,
  Database,
  ExternalLink,
  Loader2,
  Network,
  Pencil,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * The semantic-layer surface: Tracked = catalogued metrics (the moat);
 * Candidates = operationalized cards eligible to be promoted. Rendered both as
 * the top-level /catalog page and as the Data hub "Tracked Metrics" tab.
 * See the product vault.
 */
export function TrackedMetricsPanel({ intro }: { intro?: string }) {
  const client = useClerkSupabase();
  const navigate = useNavigate();

  const [tab, setTab] = useState('tracked');
  const [tracked, setTracked] = useState<TrackedMetric[]>([]);
  const [candidates, setCandidates] = useState<CandidateCard[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [usage, setUsage] = useState<Record<string, MetricUsage[]>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    name: '',
    unit: '',
    owner_label: '',
    formula: '',
  });

  const load = async () => {
    if (!client) return;
    setBusy(true);
    setError(null);
    try {
      const [t, c] = await Promise.all([
        listTrackedMetrics(client),
        listCandidateCards(client),
      ]);
      setTracked(t);
      setCandidates(c);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load the catalog.');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (client) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const promote = async (card: CandidateCard) => {
    if (!client) return;
    setError(null);
    try {
      await promoteCardToTrackedMetric(
        {
          cardId: card.id,
          projectId: card.project_id,
          name: card.title,
          formula: card.formula,
          source_kind: card.source_type ?? undefined,
        },
        client
      );
      await load();
      setTab('tracked');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to catalog metric.');
    }
  };

  const remove = async (id: string) => {
    if (!client) return;
    try {
      await deleteTrackedMetric(id, client);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to remove metric.');
    }
  };

  const startEdit = (m: TrackedMetric) => {
    setEditingId(m.id);
    setDraft({
      name: m.name ?? '',
      unit: m.unit ?? '',
      owner_label: m.owner_label ?? '',
      formula: m.formula ?? '',
    });
  };

  const saveEdit = async (id: string) => {
    if (!client || !draft.name.trim()) return;
    try {
      await updateTrackedMetric(
        id,
        {
          name: draft.name.trim(),
          unit: draft.unit.trim() || null,
          owner_label: draft.owner_label.trim() || null,
          formula: draft.formula.trim() || null,
        },
        client
      );
      setTracked((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                name: draft.name.trim(),
                unit: draft.unit.trim() || null,
                owner_label: draft.owner_label.trim() || null,
                formula: draft.formula.trim() || null,
              }
            : m
        )
      );
      setEditingId(null);

      // Push the new definition down to any referencing cards on the currently
      // open canvas so the edit shows live (local-only — referenced cards
      // re-derive name/formula from the catalog on load, so no DB write needed;
      // other/closed canvases pick it up on their next load).
      const openCards = useCanvasStore.getState().canvas?.nodes || [];
      for (const card of openCards) {
        if ((card as { trackedMetricId?: string }).trackedMetricId === id) {
          useCanvasStore.getState().updateNode(card.id, {
            title: draft.name.trim(),
            formula: draft.formula.trim() || undefined,
          });
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save metric.');
    }
  };

  const toggleUsage = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    if (!usage[id] && client) {
      try {
        const u = await getMetricUsage(id, client);
        setUsage((prev) => ({ ...prev, [id]: u }));
      } catch {
        setUsage((prev) => ({ ...prev, [id]: [] }));
      }
    }
  };

  const visibleTracked = search
    ? tracked.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase())
      )
    : tracked;

  return (
    <div>
      {intro && (
        <p className="text-sm text-muted-foreground mb-6">{intro}</p>
      )}

      {error && (
        <p className="text-sm text-destructive mb-4" role="alert">
          {error}
        </p>
      )}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="tracked">
            Tracked
            <Badge variant="secondary" className="ml-2">
              {tracked.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="candidates">
            Candidates
            <Badge variant="secondary" className="ml-2">
              {candidates.length}
            </Badge>
          </TabsTrigger>
          {busy && (
            <Loader2 className="ml-3 h-4 w-4 animate-spin self-center text-muted-foreground" />
          )}
        </TabsList>

        {/* Tracked metrics */}
        <TabsContent value="tracked" className="space-y-3">
          {tracked.length > 0 && (
            <div className="relative mb-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search metrics…"
                className="pl-9"
              />
            </div>
          )}
          {tracked.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Database className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">
                No catalogued metrics yet. Promote a candidate to start your
                catalog.
              </p>
            </div>
          ) : visibleTracked.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No metrics match “{search}”.
            </p>
          ) : (
            visibleTracked.map((m) => (
              <Card key={m.id}>
                {editingId === m.id ? (
                  <CardContent className="py-3 space-y-2">
                    <Input
                      value={draft.name}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, name: e.target.value }))
                      }
                      placeholder="Metric name"
                    />
                    <div className="flex gap-2">
                      <Input
                        value={draft.unit}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, unit: e.target.value }))
                        }
                        placeholder="Unit (e.g. $, %)"
                      />
                      <Input
                        value={draft.owner_label}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            owner_label: e.target.value,
                          }))
                        }
                        placeholder="Owner"
                      />
                    </div>
                    <Input
                      value={draft.formula}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, formula: e.target.value }))
                      }
                      placeholder="Formula"
                      className="font-mono text-xs"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => saveEdit(m.id)}
                        disabled={!draft.name.trim()}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </CardContent>
                ) : (
                  <>
                    <CardHeader className="py-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          {m.name}
                          {m.unit && (
                            <span className="text-xs font-normal text-muted-foreground">
                              ({m.unit})
                            </span>
                          )}
                        </CardTitle>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(m)}
                            title="Edit definition"
                          >
                            <Pencil className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(m.id)}
                            title="Remove from catalog"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="py-0 pb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {m.owner_label && (
                        <Badge variant="outline">owner: {m.owner_label}</Badge>
                      )}
                      {m.source_kind && (
                        <Badge variant="outline">source: {m.source_kind}</Badge>
                      )}
                      {m.formula && (
                        <span className="font-mono truncate max-w-[280px]">
                          {m.formula}
                        </span>
                      )}
                    </CardContent>
                    <CardContent className="py-0 pb-3">
                      <button
                        onClick={() => toggleUsage(m.id)}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {expandedId === m.id ? (
                          <ChevronDown className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5" />
                        )}
                        <Network className="h-3.5 w-3.5" />
                        {usage[m.id]
                          ? `Used in ${usage[m.id].length} ${usage[m.id].length === 1 ? 'place' : 'places'}`
                          : 'Where is this used?'}
                      </button>
                      {expandedId === m.id && (
                        <div className="mt-2 space-y-1 pl-5">
                          {!usage[m.id] ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                          ) : usage[m.id].length === 0 ? (
                            <p className="text-xs text-muted-foreground/70">
                              Not placed on any canvas yet.
                            </p>
                          ) : (
                            usage[m.id].map((u) => (
                              <button
                                key={u.cardId}
                                onClick={() => navigate(`/canvas/${u.projectId}`)}
                                className="flex w-full items-center gap-1.5 text-left text-xs text-muted-foreground hover:text-foreground"
                              >
                                <ExternalLink className="h-3 w-3 shrink-0" />
                                <span className="truncate">
                                  {u.cardTitle}
                                  <span className="text-muted-foreground/60">
                                    {' '}
                                    · {u.projectName}
                                  </span>
                                </span>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </CardContent>
                  </>
                )}
              </Card>
            ))
          )}
        </TabsContent>

        {/* Candidate cards */}
        <TabsContent value="candidates" className="space-y-3">
          {candidates.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Sparkles className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">
                No candidates. Wire a Source Node to a metric card (with data)
                and it will appear here, ready to catalog.
              </p>
            </div>
          ) : (
            candidates.map((c) => (
              <Card key={c.id}>
                <CardContent className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{c.title}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <Badge variant="outline">{c.points} points</Badge>
                      {c.source_type && (
                        <Badge variant="outline">{c.source_type}</Badge>
                      )}
                    </div>
                  </div>
                  <Button size="sm" onClick={() => promote(c)} className="gap-1">
                    <Sparkles className="h-4 w-4" />
                    Catalog this metric
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
