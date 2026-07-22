// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { event_propertiesCountOrderByAggregateInputObjectSchema } from './event_propertiesCountOrderByAggregateInput.schema';
import { event_propertiesMaxOrderByAggregateInputObjectSchema } from './event_propertiesMaxOrderByAggregateInput.schema';
import { event_propertiesMinOrderByAggregateInputObjectSchema } from './event_propertiesMinOrderByAggregateInput.schema'

export const event_propertiesOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.event_propertiesOrderByWithAggregationInput, Prisma.event_propertiesOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  event_id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  key: SortOrderSchema.optional(),
  data_type: SortOrderSchema.optional(),
  required: SortOrderSchema.optional(),
  allowed_values: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  example_value: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  _count: z.lazy(() => event_propertiesCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => event_propertiesMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => event_propertiesMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const event_propertiesOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  event_id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  key: SortOrderSchema.optional(),
  data_type: SortOrderSchema.optional(),
  required: SortOrderSchema.optional(),
  allowed_values: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  example_value: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  created_at: SortOrderSchema.optional(),
  _count: z.lazy(() => event_propertiesCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => event_propertiesMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => event_propertiesMinOrderByAggregateInputObjectSchema).optional()
}).strict();
