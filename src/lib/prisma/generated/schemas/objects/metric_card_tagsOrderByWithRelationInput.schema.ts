import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema'

export const metric_card_tagsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.metric_card_tagsOrderByWithRelationInput, Prisma.metric_card_tagsOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  metric_card_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  tag_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional()
}).strict();
export const metric_card_tagsOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  metric_card_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  tag_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional()
}).strict();
