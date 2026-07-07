// Impact Review (CVS-175). Turns the CVS-174 measurement into an explicit
// outcome: shows target/leading/guardrail deltas + a suggested result, lets the
// user mark won/lost/inconclusive/keep-measuring, and creates an Evidence note
// capturing the review. Self-contained: loads its own tracked-metric series.

import { useEffect, useMemo, useState } from 'react';
import { Loader2, NotebookPen } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/shared/utils';
import { Button } from '@/shared/components/ui/button';
import { useAppStore } from '@/lib/stores';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import { getMetricValuesByMetricIds } from '@/shared/lib/supabase/services/trackedMetrics';
import { createCardEvidence } from '@/shared/lib/supabase/services/evidence';
import { metricRefKey } from '@/features/strategy/impact/impactContract';
import {
  evaluateImpact,
  type GuardrailStatus,
  type ImpactEvaluation,
  type MetricEval,
} from '@/features/strategy/impact/measurement';
import type {
  ImpactContract,
  ImpactStatus,
  MetricLink,
} from '@/features/strategy/impact/types';
import type { EvidenceItem, MetricCard, MetricValue } from '@/shared/types';

interface ImpactReviewSectionProps {
  contract: ImpactContract;
  links: MetricLink[];
  cards: MetricCard[];
  cardId: string;
  cardTitle: string;
  projectId?: string;
  canEdit: boolean;
  resultNote: string;
  onMarkResult: (status: ImpactStatus) => Promise<void> | void;
}

const RESULT_OPTIONS: { status: ImpactStatus; label: string; style: string }[] = [
  { status: 'won', label: 'Won', style: 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20' },
  { status: 'lost', label: 'Lost', style: 'bg-red-500/10 text-red-600 hover:bg-red-500/20' },
  { status: 'inconclusive', label: 'Inconclusive', style: 'bg-zinc-500/10 text-zinc-600 hover:bg-zinc-500/20' },
  { status: 'measuring', label: 'Keep measuring', style: 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20' },
];

const GUARDRAIL_STYLE: Record<GuardrailStatus, string> = {
  pass: 'text-emerald-600',
  fail: 'text-red-600',
  unknown: 'text-muted-foreground',
};

/** Trim float noise: up to 2 decimals, no trailing zeros (34.8-34.6 = 0.200…03). */
function fmtNum(n: number): string {
  return `${n > 0 ? '+' : ''}${parseFloat(n.toFixed(2))}`;
}

function fmtDelta(e: MetricEval): string {
  if (!e.hasData) return 'no data';
  const pct = e.pctDelta != null ? `${e.pctDelta > 0 ? '+' : ''}${e.pctDelta.toFixed(1)}%` : null;
  const abs = e.absDelta != null ? fmtNum(e.absDelta) : null;
  return pct ? `${pct} (${abs})` : (abs ?? '—');
}

function buildEvidenceSummary(
  title: string,
  metricLabel: (e: MetricEval) => string,
  ev: ImpactEvaluation,
  resultNote: string
): string {
  const lines: string[] = [`Impact review — ${title}`, ''];
  if (ev.target) {
    lines.push(
      `Target ${metricLabel(ev.target)}: baseline ${ev.target.baseline ?? '—'} → window ${ev.target.windowValue ?? '—'} = ${fmtDelta(ev.target)}`
    );
  }
  if (ev.expected) {
    lines.push(`Expected: ${ev.expected.direction} ${ev.expected.value ?? ''}${ev.expected.unit === 'percent' ? '%' : ''} → ${ev.met}`);
  }
  for (const l of ev.leading) lines.push(`Leading ${metricLabel(l)}: ${fmtDelta(l)}`);
  for (const g of ev.guardrails) lines.push(`Guardrail ${metricLabel(g)}: ${g.status} (${fmtDelta(g)})`);
  lines.push('', `Suggested result: ${ev.suggestedResult}`);
  if (resultNote) lines.push('', `Note: ${resultNote}`);
  return lines.join('\n');
}

export function ImpactReviewSection({
  contract,
  links,
  cards,
  cardId,
  cardTitle,
  projectId,
  canEdit,
  resultNote,
  onMarkResult,
}: ImpactReviewSectionProps) {
  const client = useClerkSupabase();
  const userId = useAppStore((s) => s.user?.id);
  const [trackedValues, setTrackedValues] = useState<Record<string, MetricValue[]>>({});
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const trackedIds = useMemo(
    () =>
      links
        .filter((l) => l.refSource === 'tracked' && l.trackedMetricId)
        .map((l) => l.trackedMetricId as string),
    [links]
  );
  const trackedKey = trackedIds.slice().sort().join(',');

  useEffect(() => {
    if (!client || trackedIds.length === 0) {
      setTrackedValues({});
      return;
    }
    setLoading(true);
    getMetricValuesByMetricIds(trackedIds, client)
      .then(setTrackedValues)
      .catch(() => setTrackedValues({}))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, trackedKey]);

  const seriesByKey = useMemo(() => {
    const map: Record<string, MetricValue[]> = {};
    for (const l of links) {
      const key = metricRefKey(l);
      if (!key) continue;
      if (l.refSource === 'tracked' && l.trackedMetricId) {
        map[key] = trackedValues[l.trackedMetricId] ?? [];
      } else if (l.refSource === 'card' && l.cardId) {
        map[key] = cards.find((c) => c.id === l.cardId)?.data ?? [];
      }
    }
    return map;
  }, [links, trackedValues, cards]);

  const ev = useMemo(
    () => evaluateImpact(contract, links, seriesByKey),
    [contract, links, seriesByKey]
  );

  const labelFor = (e: MetricEval): string => {
    const link = links.find((l) => metricRefKey(l) === e.refKey);
    if (link?.refSource === 'card') return cards.find((c) => c.id === link.cardId)?.title ?? 'Metric';
    return cards.find((c) => c.trackedMetricId === link?.trackedMetricId)?.title ?? 'Tracked metric';
  };

  const handleCreateEvidence = async () => {
    if (!client || !userId || !projectId) return;
    setCreating(true);
    try {
      const evidence: EvidenceItem = {
        id: '',
        title: `Impact review: ${cardTitle}`,
        type: 'Analysis',
        date: new Date().toISOString().slice(0, 10),
        owner: userId,
        summary: buildEvidenceSummary(cardTitle, labelFor, ev, resultNote),
        hypothesis: undefined,
        createdAt: '',
        updatedAt: '',
      };
      await createCardEvidence(evidence, cardId, projectId, userId, client);
      toast.success('Evidence note created');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to create evidence');
    } finally {
      setCreating(false);
    }
  };

  if (!ev.target) return null;

  return (
    <div className="space-y-3 rounded-md border p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">Review</span>
        <span className="text-[11px] text-muted-foreground">
          suggests <span className="font-medium capitalize">{ev.suggestedResult}</span>
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-3">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Target {labelFor(ev.target)}</span>
            <span className="font-medium">
              {fmtDelta(ev.target)}{' '}
              <span className={cn('capitalize', ev.met === 'met' ? 'text-emerald-600' : ev.met === 'missed' ? 'text-red-600' : 'text-muted-foreground')}>
                · {ev.met}
              </span>
            </span>
          </div>
          {ev.leading.map((l) => (
            <div key={l.refKey} className="flex items-center justify-between text-muted-foreground">
              <span>Leading {labelFor(l)}</span>
              <span>{fmtDelta(l)}</span>
            </div>
          ))}
          {ev.guardrails.map((g) => (
            <div key={g.refKey} className="flex items-center justify-between">
              <span className="text-muted-foreground">Guardrail {labelFor(g)}</span>
              <span className={cn('font-medium capitalize', GUARDRAIL_STYLE[g.status])}>
                {g.status} · {fmtDelta(g)}
              </span>
            </div>
          ))}
          {ev.guardrailStatus === 'fail' && (
            <p className="pt-1 text-[11px] text-red-600">
              A guardrail breached — can't auto-win; review before marking Won.
            </p>
          )}
        </div>
      )}

      {canEdit && (
        <>
          <div className="flex flex-wrap gap-1.5">
            {RESULT_OPTIONS.map((r) => (
              <button
                key={r.status}
                onClick={() => onMarkResult(r.status)}
                className={cn('rounded px-2 py-1 text-[11px] font-medium', r.style)}
              >
                {r.label}
              </button>
            ))}
          </div>
          {!resultNote && (
            <p className="text-[11px] text-amber-600">Add a result note above before marking an outcome.</p>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-full gap-1.5"
            onClick={handleCreateEvidence}
            disabled={creating || !projectId}
          >
            {creating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <NotebookPen className="h-3.5 w-3.5" />}
            Create evidence note
          </Button>
        </>
      )}
    </div>
  );
}
