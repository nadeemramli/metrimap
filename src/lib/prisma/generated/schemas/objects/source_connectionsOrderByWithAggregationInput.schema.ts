// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { source_connectionsCountOrderByAggregateInputObjectSchema } from './source_connectionsCountOrderByAggregateInput.schema';
import { source_connectionsAvgOrderByAggregateInputObjectSchema } from './source_connectionsAvgOrderByAggregateInput.schema';
import { source_connectionsMaxOrderByAggregateInputObjectSchema } from './source_connectionsMaxOrderByAggregateInput.schema';
import { source_connectionsMinOrderByAggregateInputObjectSchema } from './source_connectionsMinOrderByAggregateInput.schema';
import { source_connectionsSumOrderByAggregateInputObjectSchema } from './source_connectionsSumOrderByAggregateInput.schema'

export const source_connectionsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.source_connectionsOrderByWithAggregationInput, Prisma.source_connectionsOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  warehouse_type: SortOrderSchema.optional(),
  host: SortOrderSchema.optional(),
  port: SortOrderSchema.optional(),
  database: SortOrderSchema.optional(),
  username: SortOrderSchema.optional(),
  ssl: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => source_connectionsCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => source_connectionsAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => source_connectionsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => source_connectionsMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => source_connectionsSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const source_connectionsOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  warehouse_type: SortOrderSchema.optional(),
  host: SortOrderSchema.optional(),
  port: SortOrderSchema.optional(),
  database: SortOrderSchema.optional(),
  username: SortOrderSchema.optional(),
  ssl: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  workspace_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => source_connectionsCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => source_connectionsAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => source_connectionsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => source_connectionsMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => source_connectionsSumOrderByAggregateInputObjectSchema).optional()
}).strict();
