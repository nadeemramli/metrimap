import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { groupsCountOrderByAggregateInputObjectSchema } from './groupsCountOrderByAggregateInput.schema';
import { groupsAvgOrderByAggregateInputObjectSchema } from './groupsAvgOrderByAggregateInput.schema';
import { groupsMaxOrderByAggregateInputObjectSchema } from './groupsMaxOrderByAggregateInput.schema';
import { groupsMinOrderByAggregateInputObjectSchema } from './groupsMinOrderByAggregateInput.schema';
import { groupsSumOrderByAggregateInputObjectSchema } from './groupsSumOrderByAggregateInput.schema'

export const groupsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.groupsOrderByWithAggregationInput, Prisma.groupsOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  color: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  position_x: SortOrderSchema.optional(),
  position_y: SortOrderSchema.optional(),
  width: SortOrderSchema.optional(),
  height: SortOrderSchema.optional(),
  node_ids: SortOrderSchema.optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  _count: z.lazy(() => groupsCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => groupsAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => groupsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => groupsMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => groupsSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const groupsOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  color: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  position_x: SortOrderSchema.optional(),
  position_y: SortOrderSchema.optional(),
  width: SortOrderSchema.optional(),
  height: SortOrderSchema.optional(),
  node_ids: SortOrderSchema.optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  _count: z.lazy(() => groupsCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => groupsAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => groupsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => groupsMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => groupsSumOrderByAggregateInputObjectSchema).optional()
}).strict();
