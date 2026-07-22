// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { error_reportsCountOrderByAggregateInputObjectSchema } from './error_reportsCountOrderByAggregateInput.schema';
import { error_reportsMaxOrderByAggregateInputObjectSchema } from './error_reportsMaxOrderByAggregateInput.schema';
import { error_reportsMinOrderByAggregateInputObjectSchema } from './error_reportsMinOrderByAggregateInput.schema'

export const error_reportsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.error_reportsOrderByWithAggregationInput, Prisma.error_reportsOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  clerk_user_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  reporter_user_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  reporter_email: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  message: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  error_stack: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  component_stack: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  url: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  user_agent: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  client_time: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  fingerprint: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => error_reportsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => error_reportsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => error_reportsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const error_reportsOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  clerk_user_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  reporter_user_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  reporter_email: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  message: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  error_stack: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  component_stack: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  url: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  user_agent: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  client_time: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  fingerprint: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => error_reportsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => error_reportsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => error_reportsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
