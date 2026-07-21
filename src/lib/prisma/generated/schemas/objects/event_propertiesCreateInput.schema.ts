// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { event_definitionsCreateNestedOneWithoutEvent_propertiesInputObjectSchema } from './event_definitionsCreateNestedOneWithoutEvent_propertiesInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const event_propertiesCreateInputObjectSchema: z.ZodType<Prisma.event_propertiesCreateInput, Prisma.event_propertiesCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  key: z.string(),
  data_type: z.string().optional(),
  required: z.boolean().optional(),
  allowed_values: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  example_value: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  event_definitions: z.lazy(() => event_definitionsCreateNestedOneWithoutEvent_propertiesInputObjectSchema)
}).strict();
export const event_propertiesCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  key: z.string(),
  data_type: z.string().optional(),
  required: z.boolean().optional(),
  allowed_values: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  example_value: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  event_definitions: z.lazy(() => event_definitionsCreateNestedOneWithoutEvent_propertiesInputObjectSchema)
}).strict();
