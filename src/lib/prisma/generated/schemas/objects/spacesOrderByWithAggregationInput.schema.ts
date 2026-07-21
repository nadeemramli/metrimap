// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { spacesCountOrderByAggregateInputObjectSchema } from './spacesCountOrderByAggregateInput.schema';
import { spacesAvgOrderByAggregateInputObjectSchema } from './spacesAvgOrderByAggregateInput.schema';
import { spacesMaxOrderByAggregateInputObjectSchema } from './spacesMaxOrderByAggregateInput.schema';
import { spacesMinOrderByAggregateInputObjectSchema } from './spacesMinOrderByAggregateInput.schema';
import { spacesSumOrderByAggregateInputObjectSchema } from './spacesSumOrderByAggregateInput.schema'

export const spacesOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.spacesOrderByWithAggregationInput, Prisma.spacesOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  color: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sort_order: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => spacesCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => spacesAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => spacesMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => spacesMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => spacesSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const spacesOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  color: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sort_order: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => spacesCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => spacesAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => spacesMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => spacesMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => spacesSumOrderByAggregateInputObjectSchema).optional()
}).strict();
