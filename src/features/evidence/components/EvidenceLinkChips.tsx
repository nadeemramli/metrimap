import type { EvidenceItem } from '@/shared/types';
import { cn } from '@/shared/utils';
import { Link2 } from 'lucide-react';

/**
 * Minimalist "Linked to" row: every canvas node this evidence backs
 * (evidence.links from drawn reference edges) plus the primary context link
 * (relationship-sheet attachments), deduped. Renders nothing when unlinked.
 */
export function EvidenceLinkChips({
  evidence,
  className,
}: {
  evidence: EvidenceItem;
  className?: string;
}) {
  const chips: Array<{ id: string; name: string }> = [
    ...(evidence.links || []).map((l) => ({
      id: l.targetId,
      name: l.targetName,
    })),
  ];
  if (
    evidence.context &&
    evidence.context.type !== 'general' &&
    evidence.context.targetId &&
    !chips.some((c) => c.id === evidence.context!.targetId)
  ) {
    chips.push({
      id: evidence.context.targetId,
      name: evidence.context.targetName || 'target',
    });
  }
  if (chips.length === 0) return null;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground',
        className
      )}
    >
      <Link2 className="h-3 w-3" />
      <span>Linked to</span>
      {chips.map((c) => (
        <span
          key={c.id}
          className="max-w-[140px] truncate rounded bg-muted px-1.5 py-0.5 font-medium text-foreground"
        >
          {c.name}
        </span>
      ))}
    </div>
  );
}

export default EvidenceLinkChips;
