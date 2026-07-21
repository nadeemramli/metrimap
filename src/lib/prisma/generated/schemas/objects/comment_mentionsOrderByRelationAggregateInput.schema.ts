// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const comment_mentionsOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.comment_mentionsOrderByRelationAggregateInput, Prisma.comment_mentionsOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const comment_mentionsOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
