import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { relationship_tagsCountOrderByAggregateInputObjectSchema } from './relationship_tagsCountOrderByAggregateInput.schema';
import { relationship_tagsMaxOrderByAggregateInputObjectSchema } from './relationship_tagsMaxOrderByAggregateInput.schema';
import { relationship_tagsMinOrderByAggregateInputObjectSchema } from './relationship_tagsMinOrderByAggregateInput.schema'

export const relationship_tagsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.relationship_tagsOrderByWithAggregationInput, Prisma.relationship_tagsOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  relationship_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  tag_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => relationship_tagsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => relationship_tagsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => relationship_tagsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const relationship_tagsOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  relationship_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  tag_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => relationship_tagsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => relationship_tagsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => relationship_tagsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
