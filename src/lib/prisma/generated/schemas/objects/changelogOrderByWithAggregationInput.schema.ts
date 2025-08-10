import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { changelogCountOrderByAggregateInputObjectSchema } from './changelogCountOrderByAggregateInput.schema';
import { changelogMaxOrderByAggregateInputObjectSchema } from './changelogMaxOrderByAggregateInput.schema';
import { changelogMinOrderByAggregateInputObjectSchema } from './changelogMinOrderByAggregateInput.schema'

export const changelogOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.changelogOrderByWithAggregationInput, Prisma.changelogOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  user_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  action: SortOrderSchema.optional(),
  target: SortOrderSchema.optional(),
  target_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  target_name: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  metadata: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  timestamp: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => changelogCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => changelogMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => changelogMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const changelogOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  user_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  action: SortOrderSchema.optional(),
  target: SortOrderSchema.optional(),
  target_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  target_name: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  metadata: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  timestamp: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => changelogCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => changelogMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => changelogMinOrderByAggregateInputObjectSchema).optional()
}).strict();
