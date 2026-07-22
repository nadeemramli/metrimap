// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const canvas_nodesOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.canvas_nodesOrderByRelationAggregateInput, Prisma.canvas_nodesOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const canvas_nodesOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
