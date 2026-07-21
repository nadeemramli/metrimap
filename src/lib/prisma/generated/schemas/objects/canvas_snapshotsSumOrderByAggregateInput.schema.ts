// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const canvas_snapshotsSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.canvas_snapshotsSumOrderByAggregateInput, Prisma.canvas_snapshotsSumOrderByAggregateInput> = z.object({
  version: SortOrderSchema.optional()
}).strict();
export const canvas_snapshotsSumOrderByAggregateInputObjectZodSchema = z.object({
  version: SortOrderSchema.optional()
}).strict();
