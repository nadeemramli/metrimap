// @ts-nocheck
import { z } from 'zod';

export const Connected_accountsScalarFieldEnumSchema = z.enum(['id', 'created_by', 'workspace_id', 'connector_id', 'auth_type', 'source_account_id', 'source_account_label', 'granted_scopes', 'status', 'status_detail', 'last_synced_at', 'last_query_at', 'revoked_at', 'created_at', 'updated_at'])