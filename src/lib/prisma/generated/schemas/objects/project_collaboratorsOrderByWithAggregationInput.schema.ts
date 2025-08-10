import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { project_collaboratorsCountOrderByAggregateInputObjectSchema } from './project_collaboratorsCountOrderByAggregateInput.schema';
import { project_collaboratorsMaxOrderByAggregateInputObjectSchema } from './project_collaboratorsMaxOrderByAggregateInput.schema';
import { project_collaboratorsMinOrderByAggregateInputObjectSchema } from './project_collaboratorsMinOrderByAggregateInput.schema'

export const project_collaboratorsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.project_collaboratorsOrderByWithAggregationInput, Prisma.project_collaboratorsOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  user_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  role: SortOrderSchema.optional(),
  permissions: SortOrderSchema.optional(),
  invited_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  joined_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => project_collaboratorsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => project_collaboratorsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => project_collaboratorsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const project_collaboratorsOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  user_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  role: SortOrderSchema.optional(),
  permissions: SortOrderSchema.optional(),
  invited_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  joined_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => project_collaboratorsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => project_collaboratorsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => project_collaboratorsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
