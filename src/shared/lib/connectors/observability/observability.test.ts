import { describe, it, expect, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/lib/supabase/types';
import type { RunReport } from '../runtime';
import {
  deriveHealth,
  recordConnectionEvent,
  recordRun,
  runRowFromReport,
  safeMessage,
  statusFromReport,
  type ConnectorRunRow,
} from './index';

const okReport: RunReport = {
  connector_id: 'stripe', stream: 'payment_intents', sync_mode: 'incremental',
  pages: 3, fetched: 100, skipped: 5, rejected: 2, cursor: 'created:123',
  resumable: true, started_at: '2026-07-06T00:00:00Z', finished_at: '2026-07-06T00:00:05Z',
};

describe('safeMessage — redaction', () => {
  it('redacts token-like runs and key prefixes', () => {
    expect(safeMessage('auth failed for sk_live_ABCDEFGHIJKLMNOPQR')).not.toContain('sk_live_ABCDEFGHIJKLMNOPQR');
    expect(safeMessage('cursor eyJhbGciOiJIUzI1NiJ9.payloadpayloadpayloadpayload')).toContain('[redacted]');
  });
  it('passes short safe messages through and truncates long ones', () => {
    expect(safeMessage('rate limited by source')).toBe('rate limited by source');
    expect(safeMessage(null)).toBeNull();
    expect((safeMessage('x'.repeat(500)) ?? '').length).toBeLessThanOrEqual(300);
  });
});

describe('statusFromReport', () => {
  it('success / partial / error', () => {
    expect(statusFromReport(okReport)).toBe('success');
    expect(statusFromReport({ ...okReport, error_class: 'auth', pages: 2 })).toBe('partial');
    expect(statusFromReport({ ...okReport, error_class: 'auth', pages: 0 })).toBe('error');
  });
});

describe('runRowFromReport', () => {
  it('maps a payload-free report to a row (computes accepted + duration, redacts message)', () => {
    const row = runRowFromReport({ ...okReport, error_class: 'auth', error_message: 'bad token sk_live_ABCDEFGHIJKLMNOPQR' }, { connectedAccountId: 'ca_1', materialized: 7 });
    expect(row.connector_id).toBe('stripe');
    expect(row.accepted).toBe(93); // 100 - 5 - 2
    expect(row.materialized).toBe(7);
    expect(row.duration_ms).toBe(5000);
    expect(row.event).toBe('run_failed');
    expect(row.error_message).not.toContain('sk_live_ABCDEFGHIJKLMNOPQR');
    expect(row.connected_account_id).toBe('ca_1');
  });

  it('a clean run is run_finished / success', () => {
    const row = runRowFromReport(okReport);
    expect(row.event).toBe('run_finished');
    expect(row.status).toBe('success');
  });
});

describe('deriveHealth', () => {
  const base: ConnectorRunRow = { connector_id: 'stripe', event: 'run_finished', status: 'success', pages: 1, fetched: 1, accepted: 1, skipped: 0, rejected: 0, materialized: 1, resumable: false, finished_at: '2026-07-06T00:00:00Z' };
  const now = Date.parse('2026-07-06T01:00:00Z');

  it('connection state wins for hard stops', () => {
    expect(deriveHealth(base, { connectionStatus: 'revoked' })).toBe('needs_reconnect');
    expect(deriveHealth(base, { connectionStatus: 'paused' })).toBe('paused');
  });
  it('no runs yet', () => {
    expect(deriveHealth(undefined, {})).toBe('stale');
    expect(deriveHealth(undefined, { connectionStatus: 'error' })).toBe('needs_reconnect');
  });
  it('maps error classes', () => {
    expect(deriveHealth({ ...base, status: 'error', error_class: 'auth' }, { nowMs: now })).toBe('needs_reconnect');
    expect(deriveHealth({ ...base, status: 'error', error_class: 'rate_limit' }, { nowMs: now })).toBe('rate_limited');
    expect(deriveHealth({ ...base, status: 'error', error_class: 'transient' }, { nowMs: now })).toBe('failing');
    expect(deriveHealth({ ...base, status: 'partial', error_class: 'timeout' }, { nowMs: now })).toBe('failing');
  });
  it('healthy when fresh, stale when old', () => {
    expect(deriveHealth(base, { nowMs: now })).toBe('healthy'); // 1h old, default 24h window
    expect(deriveHealth(base, { nowMs: now, staleAfterMs: 30 * 60 * 1000 })).toBe('stale'); // 1h > 30m
  });
});

describe('persistence (mocked client)', () => {
  const mockClient = () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const client = { from: vi.fn(() => ({ insert })) } as unknown as SupabaseClient<Database>;
    return { client, insert };
  };

  it('recordRun inserts a row with workspace_id', async () => {
    const { client, insert } = mockClient();
    await recordRun(client, okReport, { workspaceId: 'ws_1', connectedAccountId: 'ca_1' });
    expect(client.from).toHaveBeenCalledWith('connector_runs');
    const arg = insert.mock.calls[0][0] as Record<string, unknown>;
    expect(arg.workspace_id).toBe('ws_1');
    expect(arg.connector_id).toBe('stripe');
    expect(arg.event).toBe('run_finished');
  });

  it('recordConnectionEvent marks auth_failed as error', async () => {
    const { client, insert } = mockClient();
    await recordConnectionEvent(client, { connectorId: 'ga4', connectedAccountId: 'ca_2', event: 'auth_failed' });
    const arg = insert.mock.calls[0][0] as Record<string, unknown>;
    expect(arg.event).toBe('auth_failed');
    expect(arg.status).toBe('error');
  });
});
