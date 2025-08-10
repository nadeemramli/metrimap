import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema'

export const metric_cardsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.metric_cardsOrderByWithRelationInput, Prisma.metric_cardsOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  title: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  category: SortOrderSchema.optional(),
  sub_category: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  position_x: SortOrderSchema.optional(),
  position_y: SortOrderSchema.optional(),
  data: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source_type: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  formula: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  causal_factors: SortOrderSchema.optional(),
  dimensions: SortOrderSchema.optional(),
  owner_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  assignees: SortOrderSchema.optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional()
}).strict();
export const metric_cardsOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  project_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  title: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  category: SortOrderSchema.optional(),
  sub_category: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  position_x: SortOrderSchema.optional(),
  position_y: SortOrderSchema.optional(),
  data: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source_type: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  formula: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  causal_factors: SortOrderSchema.optional(),
  dimensions: SortOrderSchema.optional(),
  owner_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  assignees: SortOrderSchema.optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_by: SortOrderSchema.optional()
}).strict();
