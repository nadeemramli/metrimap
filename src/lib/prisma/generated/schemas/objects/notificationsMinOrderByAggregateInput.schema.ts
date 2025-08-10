import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const notificationsMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.notificationsMinOrderByAggregateInput, Prisma.notificationsMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  read: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
export const notificationsMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  read: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
