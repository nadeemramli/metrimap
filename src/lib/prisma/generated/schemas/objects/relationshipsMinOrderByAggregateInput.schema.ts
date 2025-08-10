import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const relationshipsMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.relationshipsMinOrderByAggregateInput, Prisma.relationshipsMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  source_id: SortOrderSchema.optional(),
  target_id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  confidence: SortOrderSchema.optional(),
  weight: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional()
}).strict();
export const relationshipsMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  source_id: SortOrderSchema.optional(),
  target_id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  confidence: SortOrderSchema.optional(),
  weight: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional()
}).strict();
