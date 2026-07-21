// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { connected_account_secretsCountOrderByAggregateInputObjectSchema } from './connected_account_secretsCountOrderByAggregateInput.schema';
import { connected_account_secretsMaxOrderByAggregateInputObjectSchema } from './connected_account_secretsMaxOrderByAggregateInput.schema';
import { connected_account_secretsMinOrderByAggregateInputObjectSchema } from './connected_account_secretsMinOrderByAggregateInput.schema'

export const connected_account_secretsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.connected_account_secretsOrderByWithAggregationInput, Prisma.connected_account_secretsOrderByWithAggregationInput> = z.object({
  account_id: SortOrderSchema.optional(),
  access_token: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  refresh_token: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  api_key: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  token_type: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  expires_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: SortOrderSchema.optional(),
  _count: z.lazy(() => connected_account_secretsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => connected_account_secretsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => connected_account_secretsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const connected_account_secretsOrderByWithAggregationInputObjectZodSchema = z.object({
  account_id: SortOrderSchema.optional(),
  access_token: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  refresh_token: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  api_key: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  token_type: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  expires_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: SortOrderSchema.optional(),
  _count: z.lazy(() => connected_account_secretsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => connected_account_secretsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => connected_account_secretsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
