// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { api_keysCountOrderByAggregateInputObjectSchema } from './api_keysCountOrderByAggregateInput.schema';
import { api_keysMaxOrderByAggregateInputObjectSchema } from './api_keysMaxOrderByAggregateInput.schema';
import { api_keysMinOrderByAggregateInputObjectSchema } from './api_keysMinOrderByAggregateInput.schema'

export const api_keysOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.api_keysOrderByWithAggregationInput, Prisma.api_keysOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  key_prefix: SortOrderSchema.optional(),
  key_hash: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  last_used_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => api_keysCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => api_keysMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => api_keysMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const api_keysOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  key_prefix: SortOrderSchema.optional(),
  key_hash: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  last_used_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => api_keysCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => api_keysMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => api_keysMinOrderByAggregateInputObjectSchema).optional()
}).strict();
