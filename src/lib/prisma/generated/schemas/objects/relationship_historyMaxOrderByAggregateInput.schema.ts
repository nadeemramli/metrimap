// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const relationship_historyMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.relationship_historyMaxOrderByAggregateInput, Prisma.relationship_historyMaxOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  relationship_id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  confidence: SortOrderSchema.optional(),
  weight: SortOrderSchema.optional(),
  changed_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
export const relationship_historyMaxOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  relationship_id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  confidence: SortOrderSchema.optional(),
  weight: SortOrderSchema.optional(),
  changed_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
