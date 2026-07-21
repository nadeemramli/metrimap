// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const connected_account_secretsMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.connected_account_secretsMaxOrderByAggregateInput, Prisma.connected_account_secretsMaxOrderByAggregateInput> = z.object({
  account_id: SortOrderSchema.optional(),
  access_token: SortOrderSchema.optional(),
  refresh_token: SortOrderSchema.optional(),
  api_key: SortOrderSchema.optional(),
  token_type: SortOrderSchema.optional(),
  expires_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
export const connected_account_secretsMaxOrderByAggregateInputObjectZodSchema = z.object({
  account_id: SortOrderSchema.optional(),
  access_token: SortOrderSchema.optional(),
  refresh_token: SortOrderSchema.optional(),
  api_key: SortOrderSchema.optional(),
  token_type: SortOrderSchema.optional(),
  expires_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
