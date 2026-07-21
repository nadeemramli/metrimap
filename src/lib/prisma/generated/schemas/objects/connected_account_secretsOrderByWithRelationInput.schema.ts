// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { connected_accountsOrderByWithRelationInputObjectSchema } from './connected_accountsOrderByWithRelationInput.schema'

export const connected_account_secretsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.connected_account_secretsOrderByWithRelationInput, Prisma.connected_account_secretsOrderByWithRelationInput> = z.object({
  account_id: SortOrderSchema.optional(),
  access_token: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  refresh_token: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  api_key: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  token_type: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  expires_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: SortOrderSchema.optional(),
  connected_accounts: z.lazy(() => connected_accountsOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const connected_account_secretsOrderByWithRelationInputObjectZodSchema = z.object({
  account_id: SortOrderSchema.optional(),
  access_token: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  refresh_token: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  api_key: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  token_type: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  expires_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: SortOrderSchema.optional(),
  connected_accounts: z.lazy(() => connected_accountsOrderByWithRelationInputObjectSchema).optional()
}).strict();
