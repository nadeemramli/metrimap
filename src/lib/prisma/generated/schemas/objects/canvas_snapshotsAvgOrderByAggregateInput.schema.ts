// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const canvas_snapshotsAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.canvas_snapshotsAvgOrderByAggregateInput, Prisma.canvas_snapshotsAvgOrderByAggregateInput> = z.object({
  version: SortOrderSchema.optional()
}).strict();
export const canvas_snapshotsAvgOrderByAggregateInputObjectZodSchema = z.object({
  version: SortOrderSchema.optional()
}).strict();
