// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const comment_threadsOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.comment_threadsOrderByRelationAggregateInput, Prisma.comment_threadsOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const comment_threadsOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
