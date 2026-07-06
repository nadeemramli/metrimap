// Health derivation (CVS-145): map the latest run + connection status to an
// operator-facing health state. Pure + injectable clock so it's deterministic in tests.
import type { ConnectorHealth, ConnectorRunRow } from './types';

export interface HealthOpts {
  /** connected_accounts.status: 'connected' | 'pending' | 'error' | 'revoked' | 'paused'. */
  connectionStatus?: string;
  nowMs?: number;
  /** A successful run older than this is 'stale'. Default 24h. */
  staleAfterMs?: number;
}

/**
 * Derive health from the most recent run and the connection state. Connection state
 * wins for hard-stops (revoked → needs_reconnect, paused → paused); otherwise the last
 * run's outcome + error class decides, with a staleness fallback.
 */
export function deriveHealth(latest: ConnectorRunRow | undefined, opts: HealthOpts = {}): ConnectorHealth {
  if (opts.connectionStatus === 'revoked') return 'needs_reconnect';
  if (opts.connectionStatus === 'paused') return 'paused';

  if (!latest) {
    // no runs yet: a broken connection needs attention, otherwise it's simply stale.
    return opts.connectionStatus === 'error' ? 'needs_reconnect' : 'stale';
  }

  if (latest.status === 'error' || latest.status === 'partial') {
    switch (latest.error_class) {
      case 'auth':
        return 'needs_reconnect';
      case 'rate_limit':
        return 'rate_limited';
      default:
        return 'failing'; // transient / timeout / permanent / unknown
    }
  }

  // success — check freshness
  const now = opts.nowMs ?? Date.now();
  const staleAfter = opts.staleAfterMs ?? 24 * 60 * 60 * 1000;
  const finishedMs = latest.finished_at ? Date.parse(latest.finished_at) : NaN;
  if (!Number.isNaN(finishedMs) && now - finishedMs > staleAfter) return 'stale';
  return 'healthy';
}
