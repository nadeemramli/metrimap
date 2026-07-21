// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const project_collaboratorsOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.project_collaboratorsOrderByRelationAggregateInput, Prisma.project_collaboratorsOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const project_collaboratorsOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
