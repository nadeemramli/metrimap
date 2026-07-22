// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { event_definitionsOrderByWithRelationInputObjectSchema } from './event_definitionsOrderByWithRelationInput.schema'

export const event_propertiesOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.event_propertiesOrderByWithRelationInput, Prisma.event_propertiesOrderByWithRelationInput> = z.object({
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
  event_definitions: z.lazy(() => event_definitionsOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const event_propertiesOrderByWithRelationInputObjectZodSchema = z.object({
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
  event_definitions: z.lazy(() => event_definitionsOrderByWithRelationInputObjectSchema).optional()
}).strict();
