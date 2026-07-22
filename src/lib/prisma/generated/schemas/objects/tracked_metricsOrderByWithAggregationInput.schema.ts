// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { tracked_metricsCountOrderByAggregateInputObjectSchema } from './tracked_metricsCountOrderByAggregateInput.schema';
import { tracked_metricsMaxOrderByAggregateInputObjectSchema } from './tracked_metricsMaxOrderByAggregateInput.schema';
import { tracked_metricsMinOrderByAggregateInputObjectSchema } from './tracked_metricsMinOrderByAggregateInput.schema'

export const tracked_metricsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.tracked_metricsOrderByWithAggregationInput, Prisma.tracked_metricsOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  unit: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  formula: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  owner_label: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  state: SortOrderSchema.optional(),
  origin_card_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  origin_project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source_kind: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => tracked_metricsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => tracked_metricsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => tracked_metricsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const tracked_metricsOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  unit: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  formula: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  owner_label: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  state: SortOrderSchema.optional(),
  origin_card_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  origin_project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source_kind: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => tracked_metricsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => tracked_metricsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => tracked_metricsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
