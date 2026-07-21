// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const canvas_snapshotsOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.canvas_snapshotsOrderByRelationAggregateInput, Prisma.canvas_snapshotsOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const canvas_snapshotsOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
