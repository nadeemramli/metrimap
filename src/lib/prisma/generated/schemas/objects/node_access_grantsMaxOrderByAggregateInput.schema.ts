// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const node_access_grantsMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.node_access_grantsMaxOrderByAggregateInput, Prisma.node_access_grantsMaxOrderByAggregateInput> = z.object({
  metric_card_id: SortOrderSchema.optional(),
  group_id: SortOrderSchema.optional()
}).strict();
export const node_access_grantsMaxOrderByAggregateInputObjectZodSchema = z.object({
  metric_card_id: SortOrderSchema.optional(),
  group_id: SortOrderSchema.optional()
}).strict();
