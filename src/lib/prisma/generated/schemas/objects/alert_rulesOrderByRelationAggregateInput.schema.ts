// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const alert_rulesOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.alert_rulesOrderByRelationAggregateInput, Prisma.alert_rulesOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const alert_rulesOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
