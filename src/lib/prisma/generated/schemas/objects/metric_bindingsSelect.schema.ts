// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsArgsObjectSchema } from './connected_accountsArgs.schema';
import { tracked_metricsArgsObjectSchema } from './tracked_metricsArgs.schema'

export const metric_bindingsSelectObjectSchema: z.ZodType<Prisma.metric_bindingsSelect, Prisma.metric_bindingsSelect> = z.object({
  id: z.boolean().optional(),
  created_by: z.boolean().optional(),
  workspace_id: z.boolean().optional(),
  connected_account_id: z.boolean().optional(),
  connector_id: z.boolean().optional(),
  stream: z.boolean().optional(),
  canonical_schema: z.boolean().optional(),
  recipe: z.boolean().optional(),
  tracked_metric_id: z.boolean().optional(),
  enabled: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  connected_accounts: z.union([z.boolean(), z.lazy(() => connected_accountsArgsObjectSchema)]).optional(),
  tracked_metrics: z.union([z.boolean(), z.lazy(() => tracked_metricsArgsObjectSchema)]).optional()
}).strict();
export const metric_bindingsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  created_by: z.boolean().optional(),
  workspace_id: z.boolean().optional(),
  connected_account_id: z.boolean().optional(),
  connector_id: z.boolean().optional(),
  stream: z.boolean().optional(),
  canonical_schema: z.boolean().optional(),
  recipe: z.boolean().optional(),
  tracked_metric_id: z.boolean().optional(),
  enabled: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  connected_accounts: z.union([z.boolean(), z.lazy(() => connected_accountsArgsObjectSchema)]).optional(),
  tracked_metrics: z.union([z.boolean(), z.lazy(() => tracked_metricsArgsObjectSchema)]).optional()
}).strict();
