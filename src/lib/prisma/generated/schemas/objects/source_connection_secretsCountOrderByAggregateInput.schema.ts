// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const source_connection_secretsCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.source_connection_secretsCountOrderByAggregateInput, Prisma.source_connection_secretsCountOrderByAggregateInput> = z.object({
  connection_id: SortOrderSchema.optional(),
  password: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
export const source_connection_secretsCountOrderByAggregateInputObjectZodSchema = z.object({
  connection_id: SortOrderSchema.optional(),
  password: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
