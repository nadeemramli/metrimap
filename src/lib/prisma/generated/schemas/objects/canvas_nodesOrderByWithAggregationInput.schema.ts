// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { canvas_nodesCountOrderByAggregateInputObjectSchema } from './canvas_nodesCountOrderByAggregateInput.schema';
import { canvas_nodesAvgOrderByAggregateInputObjectSchema } from './canvas_nodesAvgOrderByAggregateInput.schema';
import { canvas_nodesMaxOrderByAggregateInputObjectSchema } from './canvas_nodesMaxOrderByAggregateInput.schema';
import { canvas_nodesMinOrderByAggregateInputObjectSchema } from './canvas_nodesMinOrderByAggregateInput.schema';
import { canvas_nodesSumOrderByAggregateInputObjectSchema } from './canvas_nodesSumOrderByAggregateInput.schema'

export const canvas_nodesOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.canvas_nodesOrderByWithAggregationInput, Prisma.canvas_nodesOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  node_type: SortOrderSchema.optional(),
  title: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  position_x: SortOrderSchema.optional(),
  position_y: SortOrderSchema.optional(),
  data: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  _count: z.lazy(() => canvas_nodesCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => canvas_nodesAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => canvas_nodesMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => canvas_nodesMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => canvas_nodesSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const canvas_nodesOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  node_type: SortOrderSchema.optional(),
  title: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  position_x: SortOrderSchema.optional(),
  position_y: SortOrderSchema.optional(),
  data: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  _count: z.lazy(() => canvas_nodesCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => canvas_nodesAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => canvas_nodesMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => canvas_nodesMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => canvas_nodesSumOrderByAggregateInputObjectSchema).optional()
}).strict();
