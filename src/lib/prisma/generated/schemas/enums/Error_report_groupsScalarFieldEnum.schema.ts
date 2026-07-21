// @ts-nocheck
import { z } from 'zod';

export const Error_report_groupsScalarFieldEnumSchema = z.enum(['fingerprint', 'title', 'first_seen_at', 'last_seen_at', 'occurrence_count', 'last_synced_count', 'severity', 'sample_report_id', 'linear_issue_id', 'linear_issue_identifier', 'linear_issue_url', 'sync_status', 'sync_error', 'linear_synced_at', 'created_at', 'updated_at'])