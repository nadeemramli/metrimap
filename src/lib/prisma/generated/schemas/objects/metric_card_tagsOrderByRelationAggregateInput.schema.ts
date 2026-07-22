// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const metric_card_tagsOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.metric_card_tagsOrderByRelationAggregateInput, Prisma.metric_card_tagsOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const metric_card_tagsOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
