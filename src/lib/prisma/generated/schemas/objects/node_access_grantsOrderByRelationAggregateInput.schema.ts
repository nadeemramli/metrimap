// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const node_access_grantsOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.node_access_grantsOrderByRelationAggregateInput, Prisma.node_access_grantsOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const node_access_grantsOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
