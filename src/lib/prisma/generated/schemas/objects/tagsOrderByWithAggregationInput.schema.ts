import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { tagsCountOrderByAggregateInputObjectSchema } from './tagsCountOrderByAggregateInput.schema';
import { tagsMaxOrderByAggregateInputObjectSchema } from './tagsMaxOrderByAggregateInput.schema';
import { tagsMinOrderByAggregateInputObjectSchema } from './tagsMinOrderByAggregateInput.schema'

export const tagsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.tagsOrderByWithAggregationInput, Prisma.tagsOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  color: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => tagsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => tagsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => tagsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const tagsOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  color: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => tagsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => tagsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => tagsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
