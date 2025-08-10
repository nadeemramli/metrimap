import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const usersCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.usersCountOrderByAggregateInput, Prisma.usersCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  avatar_url: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
export const usersCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  avatar_url: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
