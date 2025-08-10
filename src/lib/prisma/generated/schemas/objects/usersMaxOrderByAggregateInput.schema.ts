import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const usersMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.usersMaxOrderByAggregateInput, Prisma.usersMaxOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  avatar_url: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
export const usersMaxOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  avatar_url: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
