// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const node_access_grantsCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.node_access_grantsCountOrderByAggregateInput, Prisma.node_access_grantsCountOrderByAggregateInput> = z.object({
  metric_card_id: SortOrderSchema.optional(),
  group_id: SortOrderSchema.optional()
}).strict();
export const node_access_grantsCountOrderByAggregateInputObjectZodSchema = z.object({
  metric_card_id: SortOrderSchema.optional(),
  group_id: SortOrderSchema.optional()
}).strict();
