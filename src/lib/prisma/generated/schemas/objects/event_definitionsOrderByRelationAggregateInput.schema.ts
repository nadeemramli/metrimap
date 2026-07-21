// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const event_definitionsOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.event_definitionsOrderByRelationAggregateInput, Prisma.event_definitionsOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const event_definitionsOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
