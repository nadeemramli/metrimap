import { CommentsTab } from '@/features/canvas/components/panels/metric-panel/tabs/comments-tab';
import { NodePanelShell } from '@/features/canvas/components/panels/shared/NodePanelShell';
import { useCanvasPermission } from '@/features/canvas/hooks/useCanvasPermission';
import { buildValueJourney } from '@/features/strategy/utils/valueJourney';
import { useCanvasStore } from '@/lib/stores';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type { CardWorkflow, MetricCard } from '@/shared/types';
import { Gem, Hammer } from 'lucide-react';
import { useMemo } from 'react';
import { toast } from 'sonner';

// Detail panel for Core/Value nodes — the key-journey backbone. No data or
// metrics: just context (journey type, impact, stakeholders), a read-only
// summary of what it connects to, and discussion.

const VALUE_SUBTYPES = ['Journey Step', 'Value Chain', 'Critical Path'];
const IMPACT_LEVELS: CardWorkflow['businessImpact'][] = ['High', 'Medium', 'Low'];

interface ValueContextPanelProps {
  cardId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ValueContextPanel({
  cardId,
  isOpen,
  onClose,
}: ValueContextPanelProps) {
  const card = useCanvasStore((s) =>
    cardId ? s.canvas?.nodes.find((n) => n.id === cardId) : undefined
  ) as MetricCard | undefined;
  const nodes = useCanvasStore((s) => s.canvas?.nodes);
  const edges = useCanvasStore((s) => s.canvas?.edges);
  const projectId = useCanvasStore((s) => s.canvas?.id);
  const persistNodeUpdate = useCanvasStore((s) => s.persistNodeUpdate);
  const { canEdit } = useCanvasPermission(projectId);

  const workflow = card?.workflow ?? {};

  const connected = useMemo(() => {
    if (!card || !nodes) return null;
    const steps = buildValueJourney(nodes, edges ?? []);
    return steps.find((s) => s.card.id === card.id) ?? null;
  }, [card, nodes, edges]);

  if (!card) return null;

  const persist = (updates: Partial<MetricCard>) => {
    if (!cardId) return;
    persistNodeUpdate(cardId, {
      ...updates,
      updatedAt: new Date().toISOString(),
    }).catch(() => toast.error('Failed to save'));
  };
  const patchWorkflow = (patch: Partial<CardWorkflow>) =>
    persist({ workflow: { ...workflow, ...patch } });

  const health = connected?.metricHealth;

  return (
    <NodePanelShell
      open={isOpen}
      onOpenChange={(o) => !o && onClose()}
      title={card.title || ''}
      description={card.description || ''}
      readOnly={!canEdit}
      onTitleChange={(v) => persist({ title: v })}
      onDescriptionChange={(v) => persist({ description: v })}
      eyebrow={
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
          <Gem className="h-3.5 w-3.5" />
          Value · {card.subCategory || 'Journey'}
        </span>
      }
    >
      <div className="space-y-6">
        {/* Context */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Journey type</Label>
            <Select
              value={card.subCategory ?? ''}
              disabled={!canEdit}
              onValueChange={(v) => persist({ subCategory: v as never })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                {VALUE_SUBTYPES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Business impact</Label>
            <Select
              value={workflow.businessImpact ?? ''}
              disabled={!canEdit}
              onValueChange={(v) =>
                patchWorkflow({ businessImpact: v as CardWorkflow['businessImpact'] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                {IMPACT_LEVELS.map((l) => (
                  <SelectItem key={l} value={l as string}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="value-stakeholders">Stakeholders</Label>
            <Input
              id="value-stakeholders"
              disabled={!canEdit}
              defaultValue={(workflow.stakeholders ?? []).join(', ')}
              placeholder="Growth, Product, …"
              onBlur={(e) => {
                const list = e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean);
                patchWorkflow({ stakeholders: list });
              }}
            />
          </div>
        </div>

        {/* Connected summary (read-only) */}
        <div className="rounded-lg border p-4">
          <h4 className="mb-2 text-sm font-semibold">In this journey</h4>
          {connected ? (
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                Connected metrics:
                {health && health.total > 0 ? (
                  <span className="flex items-center gap-1.5">
                    {health.up > 0 && (
                      <span className="flex items-center gap-0.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        {health.up}
                      </span>
                    )}
                    {health.down > 0 && (
                      <span className="flex items-center gap-0.5">
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                        {health.down}
                      </span>
                    )}
                    {health.flat > 0 && (
                      <span className="flex items-center gap-0.5">
                        <span className="h-2 w-2 rounded-full bg-muted-foreground/50" />
                        {health.flat}
                      </span>
                    )}
                  </span>
                ) : (
                  <span>none</span>
                )}
              </span>
              <Badge variant="outline" className="gap-1">
                <Hammer className="h-3 w-3" />
                {connected.workCount} work item
                {connected.workCount === 1 ? '' : 's'}
              </Badge>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Connect this value node to metrics and actions on the canvas to
              see its journey context.
            </p>
          )}
        </div>

        {/* Discussion */}
        {cardId && <CommentsTab cardId={cardId} />}
      </div>
    </NodePanelShell>
  );
}

export default ValueContextPanel;
