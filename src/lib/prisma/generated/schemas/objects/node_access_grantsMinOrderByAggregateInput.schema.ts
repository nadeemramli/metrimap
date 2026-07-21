// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const node_access_grantsMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.node_access_grantsMinOrderByAggregateInput, Prisma.node_access_grantsMinOrderByAggregateInput> = z.object({
  metric_card_id: SortOrderSchema.optional(),
  group_id: SortOrderSchema.optional()
}).strict();
export const node_access_grantsMinOrderByAggregateInputObjectZodSchema = z.object({
  metric_card_id: SortOrderSchema.optional(),
  group_id: SortOrderSchema.optional()
}).strict();
