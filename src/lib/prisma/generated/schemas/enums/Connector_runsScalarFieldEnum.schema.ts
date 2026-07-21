// @ts-nocheck
import { z } from 'zod';

export const Connector_runsScalarFieldEnumSchema = z.enum(['id', 'created_by', 'workspace_id', 'connected_account_id', 'connector_id', 'stream', 'event', 'status', 'sync_mode', 'pages', 'fetched', 'accepted', 'skipped', 'rejected', 'materialized', 'cursor', 'error_class', 'error_message', 'resumable', 'duration_ms', 'started_at', 'finished_at', 'created_at'])