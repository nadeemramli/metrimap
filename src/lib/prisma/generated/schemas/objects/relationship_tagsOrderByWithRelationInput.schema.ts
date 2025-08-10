import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema'

export const relationship_tagsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.relationship_tagsOrderByWithRelationInput, Prisma.relationship_tagsOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  relationship_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  tag_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional()
}).strict();
export const relationship_tagsOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  relationship_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  tag_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional()
}).strict();
