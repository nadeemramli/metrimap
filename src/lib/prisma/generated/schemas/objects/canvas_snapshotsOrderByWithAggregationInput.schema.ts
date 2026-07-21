// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { canvas_snapshotsCountOrderByAggregateInputObjectSchema } from './canvas_snapshotsCountOrderByAggregateInput.schema';
import { canvas_snapshotsAvgOrderByAggregateInputObjectSchema } from './canvas_snapshotsAvgOrderByAggregateInput.schema';
import { canvas_snapshotsMaxOrderByAggregateInputObjectSchema } from './canvas_snapshotsMaxOrderByAggregateInput.schema';
import { canvas_snapshotsMinOrderByAggregateInputObjectSchema } from './canvas_snapshotsMinOrderByAggregateInput.schema';
import { canvas_snapshotsSumOrderByAggregateInputObjectSchema } from './canvas_snapshotsSumOrderByAggregateInput.schema'

export const canvas_snapshotsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.canvas_snapshotsOrderByWithAggregationInput, Prisma.canvas_snapshotsOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  canvas_id: SortOrderSchema.optional(),
  version: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  nodes: SortOrderSchema.optional(),
  edges: SortOrderSchema.optional(),
  groups: SortOrderSchema.optional(),
  metadata: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  _count: z.lazy(() => canvas_snapshotsCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => canvas_snapshotsAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => canvas_snapshotsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => canvas_snapshotsMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => canvas_snapshotsSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const canvas_snapshotsOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  canvas_id: SortOrderSchema.optional(),
  version: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  nodes: SortOrderSchema.optional(),
  edges: SortOrderSchema.optional(),
  groups: SortOrderSchema.optional(),
  metadata: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  _count: z.lazy(() => canvas_snapshotsCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => canvas_snapshotsAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => canvas_snapshotsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => canvas_snapshotsMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => canvas_snapshotsSumOrderByAggregateInputObjectSchema).optional()
}).strict();
