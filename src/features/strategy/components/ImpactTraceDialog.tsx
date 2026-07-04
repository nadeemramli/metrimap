// Visual Impact Trace (CVS-173). For any Action/Hypothesis, renders the straight
// line from the work item → target/leading/guardrail metrics → KPI roll-up path →
// dashboard widget, with relationship labels and actionable gaps. Self-contained:
// loads its own data from the canvas so it can be opened from the Strategy panel,
// the Strategy Tree, and the Dashboard impact overlay.

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ExternalLink,
  FlaskConical,
  Hammer,
  LayoutGrid,
  Loader2,
  Target,
  TrendingUp,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import { getProjectById } from '@/shared/lib/supabase/services/projects';
import { listWidgets } from '@/shared/lib/supabase/services/dashboards';
import { listTrackedMetrics } from '@/shared/lib/supabase/services/trackedMetrics';
import {
  getContractForNode,
  getMetricLinks,
} from '@/shared/lib/supabase/services/strategyImpact';
import {
  resolveImpactTrace,
  type ImpactTrace,
  type TraceMetricRef,
  type TraceWidget,
} from '@/features/strategy/impact/impactTrace';
import type { MetricCard, Relationship } from '@/shared/types';
import type { MetricLink } from '@/features/strategy/impact/types';

interface ImpactTraceDialogProps {
  nodeId: string | null;
  projectId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImpactTraceDialog({
  nodeId,
  projectId,
  open,
  onOpenChange,
}: ImpactTraceDialogProps) {
  const client = useClerkSupabase();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<MetricCard[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [links, setLinks] = useState<MetricLink[]>([]);
  const [widgets, setWidgets] = useState<TraceWidget[]>([]);
  const [trackedNames, setTrackedNames] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open || !nodeId || !projectId || !client) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const [project, w, metrics, contract] = await Promise.all([
          getProjectById(projectId, client).catch(() => null),
          listWidgets(projectId, client).catch(() => []),
          listTrackedMetrics(client).catch(() => []),
          getContractForNode(nodeId, client).catch(() => null),
        ]);
        if (cancelled) return;
        setCards(project?.nodes ?? []);
        setRelationships(project?.edges ?? []);
        setWidgets(
          w.map((x) => ({ id: x.id, title: x.title, config: x.config }))
        );
        setTrackedNames(Object.fromEntries(metrics.map((m) => [m.id, m.name])));
        const l = contract ? await getMetricLinks(contract.id, client) : [];
        if (!cancelled) setLinks(l);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, nodeId, projectId, client]);

  const node = useMemo(
    () => cards.find((c) => c.id === nodeId) ?? null,
    [cards, nodeId]
  );
  const trace: ImpactTrace | null = useMemo(() => {
    if (!nodeId) return null;
    return resolveImpactTrace({ strategyNodeId: nodeId, links, cards, relationships, widgets });
  }, [nodeId, links, cards, relationships, widgets]);

  const label = (ref: TraceMetricRef) =>
    ref.label ?? (ref.trackedMetricId ? trackedNames[ref.trackedMetricId] : null) ?? 'Metric';

  const isHypothesis = node?.category === 'Ideas/Hypothesis';
  const NodeIcon = isHypothesis ? FlaskConical : Hammer;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Impact trace
          </DialogTitle>
          <DialogDescription>
            How this work item connects to business impact.
          </DialogDescription>
        </DialogHeader>

        {loading || !trace ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Primary path: item → target → … → KPI */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-lg border bg-muted/30 p-3">
              <TraceNode
                icon={<NodeIcon className={isHypothesis ? 'h-3.5 w-3.5 text-purple-500' : 'h-3.5 w-3.5 text-blue-500'} />}
                title={node?.title || 'Strategy item'}
                emphasis
              />
              {trace.target ? (
                <>
                  <Connector label="targets" />
                  {trace.kpiPath.length > 0 ? (
                    trace.kpiPath.map((c, i) => (
                      <span key={c.id} className="flex items-center gap-1.5">
                        {i > 0 && <Connector label="rolls_up_to" />}
                        <TraceNode
                          icon={i === trace.kpiPath.length - 1 ? <TrendingUp className="h-3.5 w-3.5 text-primary" /> : <Target className="h-3.5 w-3.5 text-muted-foreground" />}
                          title={c.title || 'Untitled'}
                        />
                      </span>
                    ))
                  ) : (
                    <TraceNode
                      icon={<Target className="h-3.5 w-3.5 text-muted-foreground" />}
                      title={label(trace.target)}
                      muted={!trace.target.onCanvas}
                    />
                  )}
                </>
              ) : (
                <Gap text="No target metric — add one in the Impact panel." />
              )}
            </div>

            {/* shown_on: dashboard widgets */}
            {trace.target && (
              <TraceRow
                label="shown_on"
                emptyText="Target metric isn't on any dashboard widget yet."
                refs={trace.target.widgets.map((w) => ({ id: w.id, title: w.title || 'Widget' }))}
                icon={<LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />}
              />
            )}

            {/* leads_to */}
            <TraceRow
              label="leads_to"
              emptyText="No leading metrics linked."
              refs={trace.leading.map((l) => ({ id: l.cardId ?? l.trackedMetricId ?? label(l), title: label(l), muted: !l.onCanvas }))}
              icon={<Target className="h-3.5 w-3.5 text-muted-foreground" />}
            />

            {/* guards */}
            <TraceRow
              label="guards"
              emptyText="No guardrail metrics linked."
              refs={trace.guardrails.map((g) => ({ id: g.cardId ?? g.trackedMetricId ?? label(g), title: label(g), muted: !g.onCanvas }))}
              icon={<Target className="h-3.5 w-3.5 text-muted-foreground" />}
            />

            {/* Gaps summary */}
            {(trace.missing.noKpiPath || trace.missing.noDashboard) && trace.target && (
              <div className="space-y-1 rounded-lg border border-dashed p-3 text-xs text-muted-foreground">
                {trace.missing.noKpiPath && (
                  <p>· No path to a KPI yet — connect this metric upward on the canvas.</p>
                )}
                {trace.missing.noDashboard && (
                  <p>· Not shown on a dashboard — add a widget bound to this metric.</p>
                )}
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:justify-start">
          {projectId && (
            <>
              <Button variant="outline" size="sm" onClick={() => navigate(`/canvas/${projectId}`)}>
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                Open canvas
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate(`/canvas/${projectId}/dashboard`)}>
                <LayoutGrid className="mr-1.5 h-3.5 w-3.5" />
                Open dashboard
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TraceNode({
  icon,
  title,
  emphasis,
  muted,
}: {
  icon: React.ReactNode;
  title: string;
  emphasis?: boolean;
  muted?: boolean;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs',
        emphasis ? 'bg-background font-medium' : 'bg-background',
        muted && 'border-dashed text-muted-foreground'
      )}
    >
      {icon}
      <span className="max-w-[140px] truncate">{title}</span>
      {muted && <span className="text-[10px]">(off-canvas)</span>}
    </span>
  );
}

function Gap({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-dashed px-2 py-1 text-xs italic text-muted-foreground">
      {text}
    </span>
  );
}

function Connector({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
      <ArrowRight className="h-3 w-3" />
      <span className="font-mono">{label}</span>
      <ArrowRight className="h-3 w-3" />
    </span>
  );
}

function TraceRow({
  label,
  refs,
  emptyText,
  icon,
}: {
  label: string;
  refs: Array<{ id: string; title: string; muted?: boolean }>;
  emptyText: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs">
      <span className="w-20 shrink-0 font-mono text-[10px] text-muted-foreground">{label}</span>
      {refs.length === 0 ? (
        <span className="italic text-muted-foreground">{emptyText}</span>
      ) : (
        refs.map((r) => <TraceNode key={r.id} icon={icon} title={r.title} muted={r.muted} />)
      )}
    </div>
  );
}
