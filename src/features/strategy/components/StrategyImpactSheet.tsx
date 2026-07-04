// Strategy Impact panel (CVS-169). Right-side sheet on an Action/Hypothesis
// detail: edit the impact contract (target/leading/guardrail metrics, expected
// direction + delta, baseline + measurement window, confidence, status, result)
// and preview the Action → Target → KPI trace via the CVS-168 resolver.

import { useEffect, useMemo, useState } from 'react';
import { Loader2, Plus, Target, TrendingUp, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import { listTrackedMetrics } from '@/shared/lib/supabase/services/trackedMetrics';
import {
  deleteContract,
  getContractForNode,
  getMetricLinks,
  setMetricLinks,
  upsertContract,
} from '@/shared/lib/supabase/services/strategyImpact';
import type { MetricCard, Relationship } from '@/shared/types';
import type {
  Confidence,
  ExpectedDirection,
  ImpactContract,
  ImpactStatus,
  MetricLink,
  MetricLinkInput,
  MetricLinkRole,
} from '@/features/strategy/impact/types';
import {
  CONFIDENCE_LEVELS,
  EXPECTED_DIRECTIONS,
  IMPACT_STATUSES,
} from '@/features/strategy/impact/types';
import { resolveImpactTrace } from '@/features/strategy/impact/impactTrace';
import { ImpactReviewSection } from '@/features/strategy/components/ImpactReviewSection';

/** A selectable metric — a catalogued tracked metric or a canvas metric card. */
interface MetricOption {
  source: 'tracked' | 'card';
  id: string;
  label: string;
  unit?: string | null;
}

const METRIC_CARD_CATEGORIES = new Set(['Data/Metric', 'Core/Value']);

interface StrategyImpactSheetProps {
  cardId: string | null;
  cardTitle?: string;
  projectId?: string;
  cards: MetricCard[];
  relationships: Relationship[];
  canEdit: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenTrace?: (nodeId: string) => void;
}

function optionKey(o: Pick<MetricOption, 'source' | 'id'>): string {
  return `${o.source}:${o.id}`;
}

function optionToLinkInput(o: MetricOption, role: MetricLinkRole): MetricLinkInput {
  return {
    role,
    refSource: o.source,
    trackedMetricId: o.source === 'tracked' ? o.id : null,
    cardId: o.source === 'card' ? o.id : null,
  };
}

export function StrategyImpactSheet({
  cardId,
  cardTitle,
  projectId,
  cards,
  relationships,
  canEdit,
  open,
  onOpenChange,
  onOpenTrace,
}: StrategyImpactSheetProps) {
  const client = useClerkSupabase();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [contractId, setContractId] = useState<string | null>(null);

  const [target, setTarget] = useState<MetricOption | null>(null);
  const [leading, setLeading] = useState<MetricOption[]>([]);
  const [guardrails, setGuardrails] = useState<MetricOption[]>([]);

  const [direction, setDirection] = useState<ExpectedDirection | ''>('');
  const [deltaValue, setDeltaValue] = useState('');
  const [deltaUnit, setDeltaUnit] = useState<'percent' | 'absolute'>('percent');
  const [baselineStart, setBaselineStart] = useState('');
  const [baselineEnd, setBaselineEnd] = useState('');
  const [measureStart, setMeasureStart] = useState('');
  const [measureEnd, setMeasureEnd] = useState('');
  const [confidence, setConfidence] = useState<Confidence | ''>('');
  const [status, setStatus] = useState<ImpactStatus>('draft');
  const [resultNote, setResultNote] = useState('');

  const [trackedOptions, setTrackedOptions] = useState<MetricOption[]>([]);

  // Canvas metric cards are always available from props; catalog metrics load lazily.
  const cardOptions: MetricOption[] = useMemo(
    () =>
      cards
        .filter((c) => METRIC_CARD_CATEGORIES.has(c.category))
        .map((c) => ({ source: 'card', id: c.id, label: c.title || 'Untitled' })),
    [cards]
  );
  const allOptions = useMemo(
    () => [...trackedOptions, ...cardOptions],
    [trackedOptions, cardOptions]
  );

  const resetForm = () => {
    setContractId(null);
    setTarget(null);
    setLeading([]);
    setGuardrails([]);
    setDirection('');
    setDeltaValue('');
    setDeltaUnit('percent');
    setBaselineStart('');
    setBaselineEnd('');
    setMeasureStart('');
    setMeasureEnd('');
    setConfidence('');
    setStatus('draft');
    setResultNote('');
  };

  // Resolve a stored link to a display option (prefer a known option; else show its id).
  const linkToOption = (link: MetricLink, options: MetricOption[]): MetricOption => {
    const source = link.refSource;
    const id = link.refSource === 'tracked' ? link.trackedMetricId! : link.cardId!;
    return (
      options.find((o) => o.source === source && o.id === id) ?? {
        source,
        id,
        label: id,
      }
    );
  };

  // Load catalog + existing contract whenever a different card's sheet opens.
  useEffect(() => {
    if (!open || !cardId || !client) return;
    let cancelled = false;
    setLoading(true);
    resetForm();
    (async () => {
      try {
        const tracked = await listTrackedMetrics(client);
        const trackedOpts: MetricOption[] = tracked.map((m) => ({
          source: 'tracked',
          id: m.id,
          label: m.name,
          unit: m.unit,
        }));
        const options = [...trackedOpts, ...cardOptions];
        if (cancelled) return;
        setTrackedOptions(trackedOpts);

        const contract = await getContractForNode(cardId, client);
        if (cancelled) return;
        if (contract) {
          setContractId(contract.id);
          setDirection(contract.expectedDirection ?? '');
          setDeltaValue(
            contract.expectedDeltaValue != null ? String(contract.expectedDeltaValue) : ''
          );
          setDeltaUnit(contract.expectedDeltaUnit === 'absolute' ? 'absolute' : 'percent');
          setBaselineStart(contract.baselineStart ?? '');
          setBaselineEnd(contract.baselineEnd ?? '');
          setMeasureStart(contract.measureStart ?? '');
          setMeasureEnd(contract.measureEnd ?? '');
          setConfidence(contract.confidence ?? '');
          setStatus(contract.impactStatus);
          setResultNote(contract.resultNote ?? '');

          const links = await getMetricLinks(contract.id, client);
          if (cancelled) return;
          setTarget(
            links.filter((l) => l.role === 'target').map((l) => linkToOption(l, options))[0] ?? null
          );
          setLeading(
            links.filter((l) => l.role === 'leading').map((l) => linkToOption(l, options))
          );
          setGuardrails(
            links.filter((l) => l.role === 'guardrail').map((l) => linkToOption(l, options))
          );
        }
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to load impact contract');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, cardId, client]);

  // Live trace preview from the current (possibly unsaved) selections.
  // Live links + a draft contract from the current form — shared by the trace
  // preview and the review section so both reflect unsaved edits.
  const formLinks = useMemo(() => {
    const links: MetricLink[] = [];
    const push = (o: MetricOption, role: MetricLinkRole, i: number) =>
      links.push({
        id: `form-${role}-${i}`,
        contractId: 'form',
        role,
        refSource: o.source,
        trackedMetricId: o.source === 'tracked' ? o.id : null,
        cardId: o.source === 'card' ? o.id : null,
      });
    if (target) push(target, 'target', 0);
    leading.forEach((o, i) => push(o, 'leading', i));
    guardrails.forEach((o, i) => push(o, 'guardrail', i));
    return links;
  }, [target, leading, guardrails]);

  const formContract: ImpactContract = useMemo(
    () => ({
      id: contractId ?? 'draft',
      workspaceId: null,
      projectId: projectId ?? null,
      strategyNodeId: cardId ?? '',
      expectedDirection: direction || null,
      expectedDeltaValue: deltaValue.trim() === '' ? null : Number(deltaValue),
      expectedDeltaUnit: direction === 'stabilize' ? null : deltaUnit,
      baselineStart: baselineStart.trim() || null,
      baselineEnd: baselineEnd.trim() || null,
      measureStart: measureStart.trim() || null,
      measureEnd: measureEnd.trim() || null,
      baselineIsManual: false,
      confidence: confidence || null,
      impactStatus: status,
      ownerLabel: null,
      resultNote: resultNote.trim() || null,
      createdBy: '',
      createdAt: '',
      updatedAt: '',
    }),
    [contractId, projectId, cardId, direction, deltaValue, deltaUnit, baselineStart, baselineEnd, measureStart, measureEnd, confidence, status, resultNote]
  );

  const trace = useMemo(() => {
    if (!cardId) return null;
    return resolveImpactTrace({
      strategyNodeId: cardId,
      links: formLinks,
      cards,
      relationships,
      widgets: [],
    });
  }, [cardId, formLinks, cards, relationships]);

  const handleSave = async (statusOverride?: ImpactStatus) => {
    if (!cardId || !client) return;
    const nextStatus = statusOverride ?? status;
    setSaving(true);
    try {
      const contract = await upsertContract(
        {
          strategyNodeId: cardId,
          projectId: projectId ?? null,
          expectedDirection: direction || null,
          expectedDeltaValue: deltaValue.trim() === '' ? null : Number(deltaValue),
          expectedDeltaUnit: direction === 'stabilize' ? null : deltaUnit,
          baselineStart: baselineStart.trim() || null,
          baselineEnd: baselineEnd.trim() || null,
          measureStart: measureStart.trim() || null,
          measureEnd: measureEnd.trim() || null,
          confidence: confidence || null,
          impactStatus: nextStatus,
          resultNote: resultNote.trim() || null,
        },
        client
      );
      const links: MetricLinkInput[] = [
        ...(target ? [optionToLinkInput(target, 'target')] : []),
        ...leading.map((o) => optionToLinkInput(o, 'leading')),
        ...guardrails.map((o) => optionToLinkInput(o, 'guardrail')),
      ];
      await setMetricLinks(contract.id, links, client);
      setContractId(contract.id);
      toast.success('Impact contract saved');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save impact contract');
    } finally {
      setSaving(false);
    }
  };

  // Review: mark an outcome — persists the status + all current fields/links.
  const markResult = async (next: ImpactStatus) => {
    setStatus(next);
    await handleSave(next);
  };

  const handleRemove = async () => {
    if (!contractId || !client) return;
    setSaving(true);
    try {
      await deleteContract(contractId, client);
      resetForm();
      toast.success('Impact contract removed');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to remove impact contract');
    } finally {
      setSaving(false);
    }
  };

  const kpiPathLabels = trace?.kpiPath.map((c) => c.title || 'Untitled') ?? [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-[460px] flex-col overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 truncate">
            <Target className="h-4 w-4 shrink-0" />
            {cardTitle || 'Impact'}
          </SheetTitle>
          <SheetDescription>
            What should this move, by how much, and where will you see it?
          </SheetDescription>
        </SheetHeader>

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="mt-4 space-y-5 px-1 pb-6">
            {/* Trace preview */}
            <div className="rounded-md border bg-muted/40 p-3">
              <div className="mb-1 flex items-center justify-between gap-1.5 text-xs font-medium text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Impact path
                </span>
                {onOpenTrace && cardId && (
                  <button
                    onClick={() => onOpenTrace(cardId)}
                    className="text-primary hover:underline"
                  >
                    View trace
                  </button>
                )}
              </div>
              {!target ? (
                <p className="text-sm text-muted-foreground">
                  Add a target metric to measure impact.
                </p>
              ) : (
                <p className="text-sm">
                  <span className="font-medium">{cardTitle || 'This item'}</span>
                  {' → '}
                  {kpiPathLabels.length > 0 ? (
                    kpiPathLabels.join(' → ')
                  ) : (
                    <span className="text-muted-foreground">
                      {target.label}
                      {trace?.missing.targetNotOnCanvas
                        ? ' (not on this canvas)'
                        : ' (no KPI path yet)'}
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Metric roles */}
            <MetricRoleField
              label="Target metric"
              hint="The metric this bet should move."
              options={allOptions}
              value={target ? [target] : []}
              single
              disabled={!canEdit}
              onChange={(vals) => setTarget(vals[0] ?? null)}
            />
            <MetricRoleField
              label="Leading metrics"
              hint="Early signals that it's working."
              options={allOptions}
              value={leading}
              disabled={!canEdit}
              onChange={setLeading}
            />
            <MetricRoleField
              label="Guardrail metrics"
              hint="Must not get worse."
              options={allOptions}
              value={guardrails}
              disabled={!canEdit}
              onChange={setGuardrails}
            />

            <Separator />

            {/* Expected impact */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Direction</Label>
                <Select
                  value={direction || undefined}
                  onValueChange={(v) => setDirection(v as ExpectedDirection)}
                  disabled={!canEdit}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPECTED_DIRECTIONS.map((d) => (
                      <SelectItem key={d} value={d} className="capitalize">
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Expected delta</Label>
                <div className="flex gap-1.5">
                  <Input
                    type="number"
                    inputMode="decimal"
                    placeholder="e.g. 5"
                    value={deltaValue}
                    disabled={!canEdit || direction === 'stabilize'}
                    onChange={(e) => setDeltaValue(e.target.value)}
                  />
                  <Select
                    value={deltaUnit}
                    onValueChange={(v) => setDeltaUnit(v as 'percent' | 'absolute')}
                    disabled={!canEdit || direction === 'stabilize'}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">%</SelectItem>
                      <SelectItem value="absolute">abs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Baseline + measurement windows */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Baseline period</Label>
                <div className="flex items-center gap-1.5">
                  <Input placeholder="YYYY-MM" value={baselineStart} disabled={!canEdit} onChange={(e) => setBaselineStart(e.target.value)} />
                  <span className="text-muted-foreground">–</span>
                  <Input placeholder="YYYY-MM" value={baselineEnd} disabled={!canEdit} onChange={(e) => setBaselineEnd(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Measurement window</Label>
                <div className="flex items-center gap-1.5">
                  <Input placeholder="YYYY-MM" value={measureStart} disabled={!canEdit} onChange={(e) => setMeasureStart(e.target.value)} />
                  <span className="text-muted-foreground">–</span>
                  <Input placeholder="YYYY-MM" value={measureEnd} disabled={!canEdit} onChange={(e) => setMeasureEnd(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Confidence + status */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Confidence</Label>
                <Select
                  value={confidence || undefined}
                  onValueChange={(v) => setConfidence(v as Confidence)}
                  disabled={!canEdit}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONFIDENCE_LEVELS.map((c) => (
                      <SelectItem key={c} value={c} className="capitalize">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as ImpactStatus)}
                  disabled={!canEdit}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {IMPACT_STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Result note</Label>
              <Textarea
                placeholder="What happened? Summarize the outcome when measured."
                value={resultNote}
                disabled={!canEdit}
                onChange={(e) => setResultNote(e.target.value)}
                rows={3}
              />
            </div>

            {cardId && target && (
              <ImpactReviewSection
                contract={formContract}
                links={formLinks}
                cards={cards}
                cardId={cardId}
                cardTitle={cardTitle || 'Strategy item'}
                projectId={projectId}
                canEdit={canEdit}
                resultNote={resultNote}
                onMarkResult={markResult}
              />
            )}

            {canEdit && (
              <div className="flex items-center justify-between pt-1">
                {contractId ? (
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={handleRemove} disabled={saving}>
                    Remove
                  </Button>
                ) : (
                  <span />
                )}
                <Button onClick={() => handleSave()} disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save impact
                </Button>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// --- inline metric-ref picker -----------------------------------------------
interface MetricRoleFieldProps {
  label: string;
  hint: string;
  options: MetricOption[];
  value: MetricOption[];
  single?: boolean;
  disabled?: boolean;
  onChange: (next: MetricOption[]) => void;
}

function MetricRoleField({
  label,
  hint,
  options,
  value,
  single,
  disabled,
  onChange,
}: MetricRoleFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selectedKeys = new Set(value.map(optionKey));
  const filtered = options.filter(
    (o) =>
      !selectedKeys.has(optionKey(o)) &&
      (query ? o.label.toLowerCase().includes(query.toLowerCase()) : true)
  );

  const add = (o: MetricOption) => {
    onChange(single ? [o] : [...value, o]);
    setQuery('');
    if (single) setPickerOpen(false);
  };
  const remove = (o: MetricOption) =>
    onChange(value.filter((v) => optionKey(v) !== optionKey(o)));

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <Label>{label}</Label>
        <span className="text-xs text-muted-foreground">{hint}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {value.map((o) => (
          <Badge key={optionKey(o)} variant="secondary" className="gap-1">
            {o.source === 'tracked' ? '◆' : '○'} {o.label}
            {!disabled && (
              <button onClick={() => remove(o)} className="ml-0.5 rounded-full hover:bg-muted-foreground/20" aria-label={`Remove ${o.label}`}>
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}
        {!disabled && (!single || value.length === 0) && (
          <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-6 gap-1 px-2 text-xs">
                <Plus className="h-3 w-3" />
                Add
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72 p-2">
              <Input
                placeholder="Search metrics…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="mb-2"
              />
              <div className="max-h-56 space-y-1 overflow-auto">
                {filtered.length === 0 ? (
                  <p className="py-4 text-center text-xs text-muted-foreground">
                    {options.length === 0 ? 'No metrics available.' : 'No matches.'}
                  </p>
                ) : (
                  filtered.map((o) => (
                    <button
                      key={optionKey(o)}
                      onClick={() => add(o)}
                      className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                    >
                      <span className="truncate">{o.label}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {o.source === 'tracked' ? 'catalog' : 'canvas'}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
