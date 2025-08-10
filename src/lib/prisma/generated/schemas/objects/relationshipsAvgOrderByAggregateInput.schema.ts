import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const relationshipsAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.relationshipsAvgOrderByAggregateInput, Prisma.relationshipsAvgOrderByAggregateInput> = z.object({
  weight: SortOrderSchema.optional()
}).strict();
export const relationshipsAvgOrderByAggregateInputObjectZodSchema = z.object({
  weight: SortOrderSchema.optional()
}).strict();
