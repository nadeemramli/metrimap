// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { connector_cursorsCountOrderByAggregateInputObjectSchema } from './connector_cursorsCountOrderByAggregateInput.schema';
import { connector_cursorsMaxOrderByAggregateInputObjectSchema } from './connector_cursorsMaxOrderByAggregateInput.schema';
import { connector_cursorsMinOrderByAggregateInputObjectSchema } from './connector_cursorsMinOrderByAggregateInput.schema'

export const connector_cursorsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.connector_cursorsOrderByWithAggregationInput, Prisma.connector_cursorsOrderByWithAggregationInput> = z.object({
  connected_account_id: SortOrderSchema.optional(),
  connector_id: SortOrderSchema.optional(),
  stream: SortOrderSchema.optional(),
  cursor: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: SortOrderSchema.optional(),
  _count: z.lazy(() => connector_cursorsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => connector_cursorsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => connector_cursorsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const connector_cursorsOrderByWithAggregationInputObjectZodSchema = z.object({
  connected_account_id: SortOrderSchema.optional(),
  connector_id: SortOrderSchema.optional(),
  stream: SortOrderSchema.optional(),
  cursor: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: SortOrderSchema.optional(),
  _count: z.lazy(() => connector_cursorsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => connector_cursorsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => connector_cursorsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
