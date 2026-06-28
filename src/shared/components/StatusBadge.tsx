import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/utils';
import {
  badgeVariantForTone,
  getStatusMeta,
  type StatusTone,
} from '@/shared/utils/statusHelpers';

interface StatusBadgeProps {
  /** Raw status string, e.g. "Live", "Disconnected", "Needs QA". */
  status: string;
  /** Override the displayed label (defaults to `status`). */
  label?: string;
  /** Override the tone derived from `status`. */
  tone?: StatusTone;
  showIcon?: boolean;
  className?: string;
}

/**
 * Token-based status pill: maps a status string to a semantic tone + icon via
 * statusHelpers, so status indicators are consistent and theme-aware. Use
 * instead of hand-built `<span className="text-green-500">` indicators.
 */
export function StatusBadge({
  status,
  label,
  tone,
  showIcon = true,
  className,
}: StatusBadgeProps) {
  const meta = getStatusMeta(status);
  const resolvedTone = tone ?? meta.tone;
  const Icon = meta.icon;

  return (
    <Badge
      variant={badgeVariantForTone(resolvedTone)}
      className={cn('gap-1', className)}
    >
      {showIcon && <Icon className="size-3" />}
      {label ?? status}
    </Badge>
  );
}
