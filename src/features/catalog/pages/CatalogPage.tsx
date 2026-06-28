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
import {
  deleteTrackedMetric,
  listCandidateCards,
  listTrackedMetrics,
  promoteCardToTrackedMetric,
  type CandidateCard,
  type TrackedMetric,
} from '@/shared/lib/supabase/services/trackedMetrics';
import {
  ArrowLeft,
  Database,
  Loader2,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// The Metric Catalog — the user-facing surface of the semantic layer. Tracked =
// catalogued metrics (the moat); Candidates = operationalized cards eligible to
// be promoted. See docs/backlog/object-model-and-catalog.md.
export default function CatalogPage() {
  const client = useClerkSupabase();
  const navigate = useNavigate();

  const [tab, setTab] = useState('tracked');
  const [tracked, setTracked] = useState<TrackedMetric[]>([]);
  const [candidates, setCandidates] = useState<CandidateCard[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Home
          </Button>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">Metric Catalog</h1>
          </div>
          {busy && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>

      <div className="px-8 py-8 max-w-5xl mx-auto">
        <p className="text-sm text-muted-foreground mb-6">
          The shared definitions of your real, sourced metrics. A metric becomes
          trackable once a card is fed by a source — promote it here so it can be
          referenced across canvases.
        </p>

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
          </TabsList>

          {/* Tracked metrics */}
          <TabsContent value="tracked" className="space-y-3">
            {tracked.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Database className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">
                  No catalogued metrics yet. Promote a candidate to start your
                  catalog.
                </p>
              </div>
            ) : (
              tracked.map((m) => (
                <Card key={m.id}>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(m.id)}
                        title="Remove from catalog"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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
    </div>
  );
}
