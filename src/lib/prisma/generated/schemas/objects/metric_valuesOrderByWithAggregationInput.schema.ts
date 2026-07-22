// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { metric_valuesCountOrderByAggregateInputObjectSchema } from './metric_valuesCountOrderByAggregateInput.schema';
import { metric_valuesAvgOrderByAggregateInputObjectSchema } from './metric_valuesAvgOrderByAggregateInput.schema';
import { metric_valuesMaxOrderByAggregateInputObjectSchema } from './metric_valuesMaxOrderByAggregateInput.schema';
import { metric_valuesMinOrderByAggregateInputObjectSchema } from './metric_valuesMinOrderByAggregateInput.schema';
import { metric_valuesSumOrderByAggregateInputObjectSchema } from './metric_valuesSumOrderByAggregateInput.schema'

export const metric_valuesOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.metric_valuesOrderByWithAggregationInput, Prisma.metric_valuesOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  tracked_metric_id: SortOrderSchema.optional(),
  period: SortOrderSchema.optional(),
  value: SortOrderSchema.optional(),
  change_percent: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  trend: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => metric_valuesCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => metric_valuesAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => metric_valuesMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => metric_valuesMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => metric_valuesSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const metric_valuesOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  tracked_metric_id: SortOrderSchema.optional(),
  period: SortOrderSchema.optional(),
  value: SortOrderSchema.optional(),
  change_percent: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  trend: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => metric_valuesCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => metric_valuesAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => metric_valuesMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => metric_valuesMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => metric_valuesSumOrderByAggregateInputObjectSchema).optional()
}).strict();
