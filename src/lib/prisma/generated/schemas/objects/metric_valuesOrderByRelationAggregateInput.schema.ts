// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const metric_valuesOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.metric_valuesOrderByRelationAggregateInput, Prisma.metric_valuesOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const metric_valuesOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
