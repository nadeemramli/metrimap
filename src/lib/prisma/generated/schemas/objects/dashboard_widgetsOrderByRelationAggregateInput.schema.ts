// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const dashboard_widgetsOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.dashboard_widgetsOrderByRelationAggregateInput, Prisma.dashboard_widgetsOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const dashboard_widgetsOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
