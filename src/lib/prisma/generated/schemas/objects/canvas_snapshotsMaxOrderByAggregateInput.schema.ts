// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const canvas_snapshotsMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.canvas_snapshotsMaxOrderByAggregateInput, Prisma.canvas_snapshotsMaxOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  canvas_id: SortOrderSchema.optional(),
  version: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
export const canvas_snapshotsMaxOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  canvas_id: SortOrderSchema.optional(),
  version: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
