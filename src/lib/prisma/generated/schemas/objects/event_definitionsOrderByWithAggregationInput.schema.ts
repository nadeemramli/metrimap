// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { event_definitionsCountOrderByAggregateInputObjectSchema } from './event_definitionsCountOrderByAggregateInput.schema';
import { event_definitionsMaxOrderByAggregateInputObjectSchema } from './event_definitionsMaxOrderByAggregateInput.schema';
import { event_definitionsMinOrderByAggregateInputObjectSchema } from './event_definitionsMinOrderByAggregateInput.schema'

export const event_definitionsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.event_definitionsOrderByWithAggregationInput, Prisma.event_definitionsOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  key: SortOrderSchema.optional(),
  category: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  lifecycle_state: SortOrderSchema.optional(),
  source_kind: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  owner_label: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  tracked_metric_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  _count: z.lazy(() => event_definitionsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => event_definitionsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => event_definitionsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const event_definitionsOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  key: SortOrderSchema.optional(),
  category: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  lifecycle_state: SortOrderSchema.optional(),
  source_kind: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  owner_label: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  tracked_metric_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  _count: z.lazy(() => event_definitionsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => event_definitionsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => event_definitionsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
