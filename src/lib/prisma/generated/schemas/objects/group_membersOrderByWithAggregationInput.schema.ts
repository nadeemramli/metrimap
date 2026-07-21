// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { group_membersCountOrderByAggregateInputObjectSchema } from './group_membersCountOrderByAggregateInput.schema';
import { group_membersMaxOrderByAggregateInputObjectSchema } from './group_membersMaxOrderByAggregateInput.schema';
import { group_membersMinOrderByAggregateInputObjectSchema } from './group_membersMinOrderByAggregateInput.schema'

export const group_membersOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.group_membersOrderByWithAggregationInput, Prisma.group_membersOrderByWithAggregationInput> = z.object({
  group_id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  added_by: SortOrderSchema.optional(),
  added_at: SortOrderSchema.optional(),
  _count: z.lazy(() => group_membersCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => group_membersMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => group_membersMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const group_membersOrderByWithAggregationInputObjectZodSchema = z.object({
  group_id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  added_by: SortOrderSchema.optional(),
  added_at: SortOrderSchema.optional(),
  _count: z.lazy(() => group_membersCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => group_membersMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => group_membersMinOrderByAggregateInputObjectSchema).optional()
}).strict();
