// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const source_connectionsAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.source_connectionsAvgOrderByAggregateInput, Prisma.source_connectionsAvgOrderByAggregateInput> = z.object({
  port: SortOrderSchema.optional()
}).strict();
export const source_connectionsAvgOrderByAggregateInputObjectZodSchema = z.object({
  port: SortOrderSchema.optional()
}).strict();
