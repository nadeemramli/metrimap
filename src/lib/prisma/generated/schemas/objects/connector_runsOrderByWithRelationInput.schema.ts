// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { connected_accountsOrderByWithRelationInputObjectSchema } from './connected_accountsOrderByWithRelationInput.schema'

export const connector_runsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.connector_runsOrderByWithRelationInput, Prisma.connector_runsOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  connected_account_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  connector_id: SortOrderSchema.optional(),
  stream: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  event: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  sync_mode: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  pages: SortOrderSchema.optional(),
  fetched: SortOrderSchema.optional(),
  accepted: SortOrderSchema.optional(),
  skipped: SortOrderSchema.optional(),
  rejected: SortOrderSchema.optional(),
  materialized: SortOrderSchema.optional(),
  cursor: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  error_class: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  error_message: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  resumable: SortOrderSchema.optional(),
  duration_ms: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  started_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  finished_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  connected_accounts: z.lazy(() => connected_accountsOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const connector_runsOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  connected_account_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  connector_id: SortOrderSchema.optional(),
  stream: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  event: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  sync_mode: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  pages: SortOrderSchema.optional(),
  fetched: SortOrderSchema.optional(),
  accepted: SortOrderSchema.optional(),
  skipped: SortOrderSchema.optional(),
  rejected: SortOrderSchema.optional(),
  materialized: SortOrderSchema.optional(),
  cursor: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  error_class: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  error_message: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  resumable: SortOrderSchema.optional(),
  duration_ms: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  started_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  finished_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  connected_accounts: z.lazy(() => connected_accountsOrderByWithRelationInputObjectSchema).optional()
}).strict();
