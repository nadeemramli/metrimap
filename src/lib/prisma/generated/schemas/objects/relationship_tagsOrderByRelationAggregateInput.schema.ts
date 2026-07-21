// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const relationship_tagsOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.relationship_tagsOrderByRelationAggregateInput, Prisma.relationship_tagsOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const relationship_tagsOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
