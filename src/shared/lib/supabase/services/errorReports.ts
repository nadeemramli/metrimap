// Insert-only crash sink written by the ErrorBoundary fallback when a user hits
// "Report this error". Uses the anon supabase() singleton so it works even for
// logged-out or broken-session users. clerk_user_id is filled server-side by the
// column DEFAULT (public.requesting_user_id()); the reporter_* fields are the
// client's best-effort identity hints. See migration 20260703120000_error_reports.sql.

import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../client';
import type { Database } from '../types';

type Client = SupabaseClient<Database>;

export interface ErrorReportPayload {
  message: string | null;
  errorStack: string | null;
  componentStack: string | null;
  note: string | null;
  url: string | null;
  userAgent: string | null;
  reporterUserId: string | null;
  reporterEmail: string | null;
  clientTime: string | null; // ISO timestamp
}

export async function submitErrorReport(
  payload: ErrorReportPayload,
  client?: Client
): Promise<void> {
  const c = client || supabase();
  const { error } = await c.from('error_reports').insert({
    message: payload.message,
    error_stack: payload.errorStack,
    component_stack: payload.componentStack,
    note: payload.note,
    url: payload.url,
    user_agent: payload.userAgent,
    reporter_user_id: payload.reporterUserId,
    reporter_email: payload.reporterEmail,
    client_time: payload.clientTime,
    // clerk_user_id is filled server-side by the column DEFAULT.
  });
  if (error) throw new Error(error.message);
}
