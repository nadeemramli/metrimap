import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { projectsCountOrderByAggregateInputObjectSchema } from './projectsCountOrderByAggregateInput.schema';
import { projectsMaxOrderByAggregateInputObjectSchema } from './projectsMaxOrderByAggregateInput.schema';
import { projectsMinOrderByAggregateInputObjectSchema } from './projectsMinOrderByAggregateInput.schema'

export const projectsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.projectsOrderByWithAggregationInput, Prisma.projectsOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  tags: SortOrderSchema.optional(),
  settings: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  last_modified_by: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  is_public: SortOrderSchema.optional(),
  _count: z.lazy(() => projectsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => projectsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => projectsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const projectsOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  tags: SortOrderSchema.optional(),
  settings: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  last_modified_by: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  is_public: SortOrderSchema.optional(),
  _count: z.lazy(() => projectsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => projectsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => projectsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
