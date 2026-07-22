// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const event_propertiesMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.event_propertiesMaxOrderByAggregateInput, Prisma.event_propertiesMaxOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  event_id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  key: SortOrderSchema.optional(),
  data_type: SortOrderSchema.optional(),
  required: SortOrderSchema.optional(),
  example_value: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
export const event_propertiesMaxOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  event_id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  key: SortOrderSchema.optional(),
  data_type: SortOrderSchema.optional(),
  required: SortOrderSchema.optional(),
  example_value: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
