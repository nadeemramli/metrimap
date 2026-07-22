// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { source_connection_secretsCountOrderByAggregateInputObjectSchema } from './source_connection_secretsCountOrderByAggregateInput.schema';
import { source_connection_secretsMaxOrderByAggregateInputObjectSchema } from './source_connection_secretsMaxOrderByAggregateInput.schema';
import { source_connection_secretsMinOrderByAggregateInputObjectSchema } from './source_connection_secretsMinOrderByAggregateInput.schema'

export const source_connection_secretsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.source_connection_secretsOrderByWithAggregationInput, Prisma.source_connection_secretsOrderByWithAggregationInput> = z.object({
  connection_id: SortOrderSchema.optional(),
  password: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  _count: z.lazy(() => source_connection_secretsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => source_connection_secretsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => source_connection_secretsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const source_connection_secretsOrderByWithAggregationInputObjectZodSchema = z.object({
  connection_id: SortOrderSchema.optional(),
  password: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  _count: z.lazy(() => source_connection_secretsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => source_connection_secretsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => source_connection_secretsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
