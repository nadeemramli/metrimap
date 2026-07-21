// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { relationship_historyCountOrderByAggregateInputObjectSchema } from './relationship_historyCountOrderByAggregateInput.schema';
import { relationship_historyAvgOrderByAggregateInputObjectSchema } from './relationship_historyAvgOrderByAggregateInput.schema';
import { relationship_historyMaxOrderByAggregateInputObjectSchema } from './relationship_historyMaxOrderByAggregateInput.schema';
import { relationship_historyMinOrderByAggregateInputObjectSchema } from './relationship_historyMinOrderByAggregateInput.schema';
import { relationship_historySumOrderByAggregateInputObjectSchema } from './relationship_historySumOrderByAggregateInput.schema'

export const relationship_historyOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.relationship_historyOrderByWithAggregationInput, Prisma.relationship_historyOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  relationship_id: SortOrderSchema.optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  type: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  confidence: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  weight: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  changed_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  _count: z.lazy(() => relationship_historyCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => relationship_historyAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => relationship_historyMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => relationship_historyMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => relationship_historySumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const relationship_historyOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  relationship_id: SortOrderSchema.optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  type: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  confidence: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  weight: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  changed_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  _count: z.lazy(() => relationship_historyCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => relationship_historyAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => relationship_historyMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => relationship_historyMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => relationship_historySumOrderByAggregateInputObjectSchema).optional()
}).strict();
