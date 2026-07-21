// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const canvas_snapshotsMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.canvas_snapshotsMinOrderByAggregateInput, Prisma.canvas_snapshotsMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  canvas_id: SortOrderSchema.optional(),
  version: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
export const canvas_snapshotsMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  canvas_id: SortOrderSchema.optional(),
  version: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
