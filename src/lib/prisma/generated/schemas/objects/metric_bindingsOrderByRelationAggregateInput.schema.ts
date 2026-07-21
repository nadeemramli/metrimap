// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const metric_bindingsOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.metric_bindingsOrderByRelationAggregateInput, Prisma.metric_bindingsOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const metric_bindingsOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
