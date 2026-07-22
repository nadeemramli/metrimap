// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const connector_cursorsOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.connector_cursorsOrderByRelationAggregateInput, Prisma.connector_cursorsOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const connector_cursorsOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
