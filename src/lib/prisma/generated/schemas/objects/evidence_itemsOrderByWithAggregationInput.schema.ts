import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { evidence_itemsCountOrderByAggregateInputObjectSchema } from './evidence_itemsCountOrderByAggregateInput.schema';
import { evidence_itemsMaxOrderByAggregateInputObjectSchema } from './evidence_itemsMaxOrderByAggregateInput.schema';
import { evidence_itemsMinOrderByAggregateInputObjectSchema } from './evidence_itemsMinOrderByAggregateInput.schema'

export const evidence_itemsOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.evidence_itemsOrderByWithAggregationInput, Prisma.evidence_itemsOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  relationship_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  title: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  date: SortOrderSchema.optional(),
  owner_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  link: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  hypothesis: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  summary: SortOrderSchema.optional(),
  impact_on_confidence: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  _count: z.lazy(() => evidence_itemsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => evidence_itemsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => evidence_itemsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const evidence_itemsOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  relationship_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  title: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  date: SortOrderSchema.optional(),
  owner_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  link: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  hypothesis: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  summary: SortOrderSchema.optional(),
  impact_on_confidence: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional(),
  _count: z.lazy(() => evidence_itemsCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => evidence_itemsMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => evidence_itemsMinOrderByAggregateInputObjectSchema).optional()
}).strict();
