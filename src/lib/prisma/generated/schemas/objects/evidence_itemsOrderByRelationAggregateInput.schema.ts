// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const evidence_itemsOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.evidence_itemsOrderByRelationAggregateInput, Prisma.evidence_itemsOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const evidence_itemsOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
