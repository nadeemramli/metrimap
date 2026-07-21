// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { workspace_groupsCountOrderByAggregateInputObjectSchema } from './workspace_groupsCountOrderByAggregateInput.schema';
import { workspace_groupsMaxOrderByAggregateInputObjectSchema } from './workspace_groupsMaxOrderByAggregateInput.schema';
import { workspace_groupsMinOrderByAggregateInputObjectSchema } from './workspace_groupsMinOrderByAggregateInput.schema'

export const workspace_groupsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.workspace_groupsOrderByWithAggregationInput, Prisma.workspace_groupsOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  color: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  _count: z.lazy(() => workspace_groupsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => workspace_groupsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => workspace_groupsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const workspace_groupsOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  workspace_id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  color: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  _count: z.lazy(() => workspace_groupsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => workspace_groupsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => workspace_groupsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
