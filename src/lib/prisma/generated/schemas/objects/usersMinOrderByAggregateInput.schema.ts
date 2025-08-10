import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const usersMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.usersMinOrderByAggregateInput, Prisma.usersMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  avatar_url: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
export const usersMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  avatar_url: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
