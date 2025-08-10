import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { relationshipsCountOrderByAggregateInputObjectSchema } from './relationshipsCountOrderByAggregateInput.schema';
import { relationshipsAvgOrderByAggregateInputObjectSchema } from './relationshipsAvgOrderByAggregateInput.schema';
import { relationshipsMaxOrderByAggregateInputObjectSchema } from './relationshipsMaxOrderByAggregateInput.schema';
import { relationshipsMinOrderByAggregateInputObjectSchema } from './relationshipsMinOrderByAggregateInput.schema';
import { relationshipsSumOrderByAggregateInputObjectSchema } from './relationshipsSumOrderByAggregateInput.schema'

export const relationshipsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.relationshipsOrderByWithAggregationInput, Prisma.relationshipsOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  target_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  type: SortOrderSchema.optional(),
  confidence: SortOrderSchema.optional(),
  weight: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  _count: z.lazy(() => relationshipsCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => relationshipsAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => relationshipsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => relationshipsMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => relationshipsSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const relationshipsOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  target_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  type: SortOrderSchema.optional(),
  confidence: SortOrderSchema.optional(),
  weight: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  _count: z.lazy(() => relationshipsCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => relationshipsAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => relationshipsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => relationshipsMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => relationshipsSumOrderByAggregateInputObjectSchema).optional()
}).strict();
