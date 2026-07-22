// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { connected_accountsOrderByWithRelationInputObjectSchema } from './connected_accountsOrderByWithRelationInput.schema'

export const connector_cursorsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.connector_cursorsOrderByWithRelationInput, Prisma.connector_cursorsOrderByWithRelationInput> = z.object({
  connected_account_id: SortOrderSchema.optional(),
  connector_id: SortOrderSchema.optional(),
  stream: SortOrderSchema.optional(),
  cursor: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: SortOrderSchema.optional(),
  connected_accounts: z.lazy(() => connected_accountsOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const connector_cursorsOrderByWithRelationInputObjectZodSchema = z.object({
  connected_account_id: SortOrderSchema.optional(),
  connector_id: SortOrderSchema.optional(),
  stream: SortOrderSchema.optional(),
  cursor: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: SortOrderSchema.optional(),
  connected_accounts: z.lazy(() => connected_accountsOrderByWithRelationInputObjectSchema).optional()
}).strict();
