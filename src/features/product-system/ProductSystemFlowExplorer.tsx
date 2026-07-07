import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/utils';
import {
  ArrowRight,
  BarChart3,
  Bot,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Database,
  Eye,
  FileText,
  Gauge,
  GitBranch,
  Layers,
  LayoutGrid,
  Lightbulb,
  Plug,
  Radar,
  Target,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  productSystemFlows,
  type ProductSystemFlow,
  type ProductSystemStep,
  type ProductSystemStepKind,
} from './flows';

// In-app explorer for the product-system operating loops (CVS-301). Reads the
// portable registry in ./flows.ts — same definitions the public site consumes
// via public/product-system-flows.json. Styled as a product inspector (native
// tokens, compact type), not a marketing section.

const KIND_ICONS: Record<ProductSystemStepKind, LucideIcon> = {
  objective: Target,
  pillar: Layers,
  problem: GitBranch,
  hypothesis: Lightbulb,
  action: Zap,
  metric: BarChart3,
  insight: Lightbulb,
  evidence: FileText,
  group: Users,
  visibility: Eye,
  view: LayoutGrid,
  dashboard: LayoutGrid,
  source: Database,
  tracking: Radar,
  quality: Gauge,
  agent: Bot,
  mcp: Plug,
  workflow: CalendarClock,
  decision: CheckCircle2,
};

function stepNumber(order: number) {
  return String(order).padStart(2, '0');
}

export interface ProductSystemFlowExplorerProps {
  /** Flows to render; defaults to the full registry. */
  flows?: ProductSystemFlow[];
  /** Initially selected flow id. */
  initialFlowId?: string;
  className?: string;
}

export function ProductSystemFlowExplorer({
  flows = productSystemFlows,
  initialFlowId,
  className,
}: ProductSystemFlowExplorerProps) {
  const [flowId, setFlowId] = useState<string>(
    () => initialFlowId ?? flows[0]?.id ?? ''
  );
  const flow = useMemo(
    () => flows.find((f) => f.id === flowId) ?? flows[0],
    [flows, flowId]
  );
  const [stepId, setStepId] = useState<string | null>(null);
  const activeStep: ProductSystemStep | undefined =
    flow?.steps.find((s) => s.id === stepId) ?? flow?.steps[0];

  const stepListRef = useRef<HTMLDivElement>(null);

  const selectFlow = (id: string) => {
    setFlowId(id);
    setStepId(null); // reset to the flow's first step
  };

  // Arrow-key navigation across the step cards (the buttons remain Tab stops).
  const onStepKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!flow || !activeStep) return;
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const idx = flow.steps.findIndex((s) => s.id === activeStep.id);
      const next =
        e.key === 'ArrowRight'
          ? flow.steps[Math.min(idx + 1, flow.steps.length - 1)]
          : flow.steps[Math.max(idx - 1, 0)];
      setStepId(next.id);
      stepListRef.current
        ?.querySelector<HTMLButtonElement>(`[data-step-id="${next.id}"]`)
        ?.focus();
    },
    [flow, activeStep]
  );

  if (!flow) return null;

  const relFor = (from: string, to: string) =>
    flow.relationships?.find((r) => r.from === from && r.to === to);

  return (
    <section className={cn('space-y-4', className)} aria-label="Product system">
      {/* Flow switcher */}
      <div
        className="flex flex-wrap items-center gap-1.5"
        role="tablist"
        aria-label="Operating loops"
      >
        {flows.map((f) => {
          const active = f.id === flow.id;
          return (
            <button
              key={f.id}
              role="tab"
              aria-selected={active}
              onClick={() => selectFlow(f.id)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                active
                  ? 'border-transparent bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {f.shortTitle}
            </button>
          );
        })}
      </div>

      <p className="max-w-2xl text-sm text-muted-foreground">{flow.summary}</p>

      {/* Step rail — numbered cards with connectors; wraps on narrow widths. */}
      <div
        ref={stepListRef}
        className="flex flex-wrap items-stretch gap-y-3"
        onKeyDown={onStepKeyDown}
      >
        {flow.steps.map((step, i) => {
          const Icon = KIND_ICONS[step.kind] ?? Target;
          const active = activeStep?.id === step.id;
          const rel = i > 0 ? relFor(flow.steps[i - 1].id, step.id) : undefined;
          return (
            <div key={step.id} className="flex items-stretch">
              {i > 0 && (
                <div
                  className="flex w-8 shrink-0 flex-col items-center justify-center"
                  aria-hidden
                  title={rel?.label}
                >
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/60" />
                </div>
              )}
              <button
                data-step-id={step.id}
                onClick={() => setStepId(step.id)}
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'w-[148px] rounded-lg border p-3 text-left transition-all duration-150',
                  active
                    ? 'border-primary/60 bg-primary/5 ring-1 ring-primary/30'
                    : 'border-border bg-card hover:border-primary/30 hover:shadow-sm'
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'font-mono text-[11px] font-semibold tabular-nums',
                      active ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {stepNumber(step.order)}
                  </span>
                  <Icon
                    className={cn(
                      'h-3.5 w-3.5',
                      active ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                </div>
                <div className="mt-1.5 truncate text-xs font-semibold text-foreground">
                  {step.label}
                </div>
                <div className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                  {step.title}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Active step detail */}
      {activeStep && (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold tabular-nums text-primary">
              {stepNumber(activeStep.order)}
            </span>
            <h3 className="text-sm font-semibold text-foreground">
              {activeStep.title}
            </h3>
            <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
              {activeStep.kind}
            </Badge>
            {(() => {
              const idx = flow.steps.findIndex((s) => s.id === activeStep.id);
              const rel =
                idx >= 0 && idx < flow.steps.length - 1
                  ? relFor(activeStep.id, flow.steps[idx + 1].id)
                  : undefined;
              return rel?.label ? (
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <ChevronRight className="h-3 w-3" />
                  {rel.label} {flow.steps[idx + 1].label.toLowerCase()}
                </span>
              ) : null;
            })()}
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {activeStep.description}
          </p>
          {activeStep.docHref && (
            <a
              href={activeStep.docHref}
              className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
            >
              Learn more
            </a>
          )}
        </div>
      )}
    </section>
  );
}
