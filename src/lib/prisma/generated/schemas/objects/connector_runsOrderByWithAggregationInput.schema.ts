// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { connector_runsCountOrderByAggregateInputObjectSchema } from './connector_runsCountOrderByAggregateInput.schema';
import { connector_runsAvgOrderByAggregateInputObjectSchema } from './connector_runsAvgOrderByAggregateInput.schema';
import { connector_runsMaxOrderByAggregateInputObjectSchema } from './connector_runsMaxOrderByAggregateInput.schema';
import { connector_runsMinOrderByAggregateInputObjectSchema } from './connector_runsMinOrderByAggregateInput.schema';
import { connector_runsSumOrderByAggregateInputObjectSchema } from './connector_runsSumOrderByAggregateInput.schema'

export const connector_runsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.connector_runsOrderByWithAggregationInput, Prisma.connector_runsOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  connected_account_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  connector_id: SortOrderSchema.optional(),
  stream: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  event: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  sync_mode: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  pages: SortOrderSchema.optional(),
  fetched: SortOrderSchema.optional(),
  accepted: SortOrderSchema.optional(),
  skipped: SortOrderSchema.optional(),
  rejected: SortOrderSchema.optional(),
  materialized: SortOrderSchema.optional(),
  cursor: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  error_class: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  error_message: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  resumable: SortOrderSchema.optional(),
  duration_ms: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  started_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  finished_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  _count: z.lazy(() => connector_runsCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => connector_runsAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => connector_runsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => connector_runsMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => connector_runsSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const connector_runsOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  connected_account_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  connector_id: SortOrderSchema.optional(),
  stream: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  event: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  sync_mode: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  pages: SortOrderSchema.optional(),
  fetched: SortOrderSchema.optional(),
  accepted: SortOrderSchema.optional(),
  skipped: SortOrderSchema.optional(),
  rejected: SortOrderSchema.optional(),
  materialized: SortOrderSchema.optional(),
  cursor: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  error_class: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  error_message: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  resumable: SortOrderSchema.optional(),
  duration_ms: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  started_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  finished_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  _count: z.lazy(() => connector_runsCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => connector_runsAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => connector_runsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => connector_runsMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => connector_runsSumOrderByAggregateInputObjectSchema).optional()
}).strict();
