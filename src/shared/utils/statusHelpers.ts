import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Wifi,
  WifiOff,
  XCircle,
  type LucideIcon,
} from 'lucide-react';

/**
 * Centralized status → tone/icon mapping. Replaces the duplicated
 * getStatusIcon / getApiStatusIcon / getDataQualityColor helpers that
 * previously lived inline in SourcePage (and were hardcoded to non-token
 * colors like text-green-500). Tones map to token-based Badge variants and
 * text classes so they respect light/dark themes.
 */
export type StatusTone = 'success' | 'info' | 'warning' | 'danger' | 'neutral';

export interface StatusMeta {
  tone: StatusTone;
  icon: LucideIcon;
}

export type StatusBadgeVariant =
  | 'success-soft'
  | 'info-soft'
  | 'warning-soft'
  | 'destructive-soft'
  | 'secondary';

const TONE_TO_BADGE_VARIANT: Record<StatusTone, StatusBadgeVariant> = {
  success: 'success-soft',
  info: 'info-soft',
  warning: 'warning-soft',
  danger: 'destructive-soft',
  neutral: 'secondary',
};

export const TONE_TEXT_CLASS: Record<StatusTone, string> = {
  success: 'text-success',
  info: 'text-info',
  warning: 'text-warning',
  danger: 'text-destructive',
  neutral: 'text-muted-foreground',
};

export function badgeVariantForTone(tone: StatusTone): StatusBadgeVariant {
  return TONE_TO_BADGE_VARIANT[tone];
}

const STATUS_MAP: Record<string, StatusMeta> = {
  // Instrumentation status (data sources)
  live: { tone: 'success', icon: CheckCircle },
  instrumented: { tone: 'info', icon: CheckCircle },
  'needs qa': { tone: 'warning', icon: Clock },
  planned: { tone: 'neutral', icon: XCircle },
  // API / connection status
  connected: { tone: 'success', icon: Wifi },
  warning: { tone: 'warning', icon: AlertTriangle },
  disconnected: { tone: 'danger', icon: WifiOff },
  // Generic statuses
  active: { tone: 'success', icon: CheckCircle },
  healthy: { tone: 'success', icon: CheckCircle },
  error: { tone: 'danger', icon: XCircle },
  failed: { tone: 'danger', icon: XCircle },
  pending: { tone: 'warning', icon: Clock },
  inactive: { tone: 'neutral', icon: XCircle },
};

export function getStatusMeta(status: string | null | undefined): StatusMeta {
  if (!status) return { tone: 'neutral', icon: Clock };
  return STATUS_MAP[status.toLowerCase()] ?? { tone: 'neutral', icon: Clock };
}

/** Tone for a 0–100 data-quality / health score. */
export function getQualityTone(quality: number | null | undefined): StatusTone {
  if (quality == null) return 'neutral';
  if (quality >= 95) return 'success';
  if (quality >= 85) return 'warning';
  return 'danger';
}

export function getQualityTextClass(
  quality: number | null | undefined
): string {
  return TONE_TEXT_CLASS[getQualityTone(quality)];
}
