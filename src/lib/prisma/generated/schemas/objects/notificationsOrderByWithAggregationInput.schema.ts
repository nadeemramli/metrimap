import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { notificationsCountOrderByAggregateInputObjectSchema } from './notificationsCountOrderByAggregateInput.schema';
import { notificationsMaxOrderByAggregateInputObjectSchema } from './notificationsMaxOrderByAggregateInput.schema';
import { notificationsMinOrderByAggregateInputObjectSchema } from './notificationsMinOrderByAggregateInput.schema'

export const notificationsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.notificationsOrderByWithAggregationInput, Prisma.notificationsOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  title: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  read: SortOrderSchema.optional(),
  metadata: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  _count: z.lazy(() => notificationsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => notificationsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => notificationsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const notificationsOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  user_id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  title: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  read: SortOrderSchema.optional(),
  metadata: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  _count: z.lazy(() => notificationsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => notificationsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => notificationsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
