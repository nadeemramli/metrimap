// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const canvas_snapshotsCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.canvas_snapshotsCountOrderByAggregateInput, Prisma.canvas_snapshotsCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  canvas_id: SortOrderSchema.optional(),
  version: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  nodes: SortOrderSchema.optional(),
  edges: SortOrderSchema.optional(),
  groups: SortOrderSchema.optional(),
  metadata: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
export const canvas_snapshotsCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  canvas_id: SortOrderSchema.optional(),
  version: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  nodes: SortOrderSchema.optional(),
  edges: SortOrderSchema.optional(),
  groups: SortOrderSchema.optional(),
  metadata: SortOrderSchema.optional(),
  created_by: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
