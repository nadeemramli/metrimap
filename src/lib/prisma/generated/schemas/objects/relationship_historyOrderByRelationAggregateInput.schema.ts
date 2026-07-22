// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const relationship_historyOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.relationship_historyOrderByRelationAggregateInput, Prisma.relationship_historyOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const relationship_historyOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
