// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const event_propertiesCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.event_propertiesCountOrderByAggregateInput, Prisma.event_propertiesCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  event_id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  key: SortOrderSchema.optional(),
  data_type: SortOrderSchema.optional(),
  required: SortOrderSchema.optional(),
  allowed_values: SortOrderSchema.optional(),
  example_value: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
export const event_propertiesCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  event_id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  key: SortOrderSchema.optional(),
  data_type: SortOrderSchema.optional(),
  required: SortOrderSchema.optional(),
  allowed_values: SortOrderSchema.optional(),
  example_value: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional()
}).strict();
