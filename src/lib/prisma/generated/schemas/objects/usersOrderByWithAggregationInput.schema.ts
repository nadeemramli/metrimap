import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { usersCountOrderByAggregateInputObjectSchema } from './usersCountOrderByAggregateInput.schema';
import { usersMaxOrderByAggregateInputObjectSchema } from './usersMaxOrderByAggregateInput.schema';
import { usersMinOrderByAggregateInputObjectSchema } from './usersMinOrderByAggregateInput.schema'

export const usersOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.usersOrderByWithAggregationInput, Prisma.usersOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  avatar_url: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => usersCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => usersMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => usersMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const usersOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  avatar_url: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => usersCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => usersMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => usersMinOrderByAggregateInputObjectSchema).optional()
}).strict();
