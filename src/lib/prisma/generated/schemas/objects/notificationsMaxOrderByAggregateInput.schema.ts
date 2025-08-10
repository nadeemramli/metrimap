import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const notificationsMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.notificationsMaxOrderByAggregateInput, Prisma.notificationsMaxOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  read: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
export const notificationsMaxOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  read: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
