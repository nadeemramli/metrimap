import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const evidence_itemsCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.evidence_itemsCountOrderByAggregateInput, Prisma.evidence_itemsCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  relationship_id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  date: SortOrderSchema.optional(),
  owner_id: SortOrderSchema.optional(),
  link: SortOrderSchema.optional(),
  hypothesis: SortOrderSchema.optional(),
  summary: SortOrderSchema.optional(),
  impact_on_confidence: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional()
}).strict();
export const evidence_itemsCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  relationship_id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  date: SortOrderSchema.optional(),
  owner_id: SortOrderSchema.optional(),
  link: SortOrderSchema.optional(),
  hypothesis: SortOrderSchema.optional(),
  summary: SortOrderSchema.optional(),
  impact_on_confidence: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional()
}).strict();
