#!/usr/bin/env node
// Manually trigger the System Health -> Linear sync bridge (edge function
// `sync-error-reports`). Use for on-demand runs or to retry failed syncs;
// the normal cadence is pg_cron every 5 min (migration 20260703140000).
//
//   node scripts/sync-error-reports.mjs                 # process pending groups
//   node scripts/sync-error-reports.mjs --retry-failed  # flip failed -> pending, then run
//
// Reads from .env (git-ignored): VITE_SUPABASE_URL, VITE_SUPABASE_SERVICE_ROLE_KEY
// (only needed for --retry-failed), and ERROR_SYNC_SECRET. Optional override:
// ERROR_SYNC_URL (full function URL). Server-only — never ship these to the client.

import fs from 'node:fs';

function loadEnv() {
  const env = { ...process.env };
  try {
    const raw = fs.readFileSync(new URL('../.env', import.meta.url), 'utf8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && env[m[1]] === undefined) {
        env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
      }
    }
  } catch {
    /* no .env — rely on process.env */
  }
  return env;
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const secret = env.ERROR_SYNC_SECRET;

if (!supabaseUrl) throw new Error('Missing VITE_SUPABASE_URL in .env');
if (!secret) throw new Error('Missing ERROR_SYNC_SECRET in .env');

const ref = new URL(supabaseUrl).hostname.split('.')[0];
const fnUrl = env.ERROR_SYNC_URL || `https://${ref}.functions.supabase.co/sync-error-reports`;

if (process.argv.includes('--retry-failed')) {
  if (!serviceKey) throw new Error('--retry-failed needs VITE_SUPABASE_SERVICE_ROLE_KEY in .env');
  const res = await fetch(`${supabaseUrl}/rest/v1/error_report_groups?sync_status=eq.failed`, {
    method: 'PATCH',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({ sync_status: 'pending' }),
  });
  const rows = await res.json().catch(() => []);
  console.log(`Reset ${Array.isArray(rows) ? rows.length : 0} failed group(s) to pending.`);
}

console.log(`Invoking ${fnUrl} …`);
const res = await fetch(fnUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-sync-secret': secret },
  body: '{}',
});
const body = await res.json().catch(() => ({}));
console.log(`HTTP ${res.status}`, JSON.stringify(body, null, 2));
process.exit(res.ok ? 0 : 1);
