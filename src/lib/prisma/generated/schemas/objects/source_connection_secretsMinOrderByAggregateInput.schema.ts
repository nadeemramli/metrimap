// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const source_connection_secretsMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.source_connection_secretsMinOrderByAggregateInput, Prisma.source_connection_secretsMinOrderByAggregateInput> = z.object({
  connection_id: SortOrderSchema.optional(),
  password: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
export const source_connection_secretsMinOrderByAggregateInputObjectZodSchema = z.object({
  connection_id: SortOrderSchema.optional(),
  password: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional()
}).strict();
