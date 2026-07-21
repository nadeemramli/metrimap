// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { connected_accountsCountOrderByAggregateInputObjectSchema } from './connected_accountsCountOrderByAggregateInput.schema';
import { connected_accountsMaxOrderByAggregateInputObjectSchema } from './connected_accountsMaxOrderByAggregateInput.schema';
import { connected_accountsMinOrderByAggregateInputObjectSchema } from './connected_accountsMinOrderByAggregateInput.schema'

export const connected_accountsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.connected_accountsOrderByWithAggregationInput, Prisma.connected_accountsOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  connector_id: SortOrderSchema.optional(),
  auth_type: SortOrderSchema.optional(),
  source_account_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source_account_label: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  granted_scopes: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  status_detail: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  last_synced_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  last_query_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  revoked_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  _count: z.lazy(() => connected_accountsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => connected_accountsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => connected_accountsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const connected_accountsOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  connector_id: SortOrderSchema.optional(),
  auth_type: SortOrderSchema.optional(),
  source_account_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source_account_label: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  granted_scopes: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  status_detail: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  last_synced_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  last_query_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  revoked_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  _count: z.lazy(() => connected_accountsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => connected_accountsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => connected_accountsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
