// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const group_membersCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.group_membersCountOrderByAggregateInput, Prisma.group_membersCountOrderByAggregateInput> = z.object({
  group_id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  added_by: SortOrderSchema.optional(),
  added_at: SortOrderSchema.optional()
}).strict();
export const group_membersCountOrderByAggregateInputObjectZodSchema = z.object({
  group_id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  added_by: SortOrderSchema.optional(),
  added_at: SortOrderSchema.optional()
}).strict();
