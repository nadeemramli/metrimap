import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const notificationsCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.notificationsCountOrderByAggregateInput, Prisma.notificationsCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  read: SortOrderSchema.optional(),
  metadata: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
export const notificationsCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  read: SortOrderSchema.optional(),
  metadata: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
