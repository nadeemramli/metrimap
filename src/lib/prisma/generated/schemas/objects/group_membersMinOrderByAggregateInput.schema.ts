// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const group_membersMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.group_membersMinOrderByAggregateInput, Prisma.group_membersMinOrderByAggregateInput> = z.object({
  group_id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  added_by: SortOrderSchema.optional(),
  added_at: SortOrderSchema.optional()
}).strict();
export const group_membersMinOrderByAggregateInputObjectZodSchema = z.object({
  group_id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  added_by: SortOrderSchema.optional(),
  added_at: SortOrderSchema.optional()
}).strict();
