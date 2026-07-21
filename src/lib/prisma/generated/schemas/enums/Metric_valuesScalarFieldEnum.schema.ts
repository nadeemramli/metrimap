// @ts-nocheck
import { z } from 'zod';

export const Metric_valuesScalarFieldEnumSchema = z.enum(['id', 'tracked_metric_id', 'period', 'value', 'change_percent', 'trend', 'source', 'created_by', 'updated_at', 'workspace_id'])