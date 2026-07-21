// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { node_access_grantsCountOrderByAggregateInputObjectSchema } from './node_access_grantsCountOrderByAggregateInput.schema';
import { node_access_grantsMaxOrderByAggregateInputObjectSchema } from './node_access_grantsMaxOrderByAggregateInput.schema';
import { node_access_grantsMinOrderByAggregateInputObjectSchema } from './node_access_grantsMinOrderByAggregateInput.schema'

export const node_access_grantsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.node_access_grantsOrderByWithAggregationInput, Prisma.node_access_grantsOrderByWithAggregationInput> = z.object({
  metric_card_id: SortOrderSchema.optional(),
  group_id: SortOrderSchema.optional(),
  _count: z.lazy(() => node_access_grantsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => node_access_grantsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => node_access_grantsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const node_access_grantsOrderByWithAggregationInputObjectZodSchema = z.object({
  metric_card_id: SortOrderSchema.optional(),
  group_id: SortOrderSchema.optional(),
  _count: z.lazy(() => node_access_grantsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => node_access_grantsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => node_access_grantsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
