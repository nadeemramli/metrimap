// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const event_propertiesOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.event_propertiesOrderByRelationAggregateInput, Prisma.event_propertiesOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const event_propertiesOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
