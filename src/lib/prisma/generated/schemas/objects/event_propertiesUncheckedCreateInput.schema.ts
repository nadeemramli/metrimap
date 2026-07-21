// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const event_propertiesUncheckedCreateInputObjectSchema: z.ZodType<Prisma.event_propertiesUncheckedCreateInput, Prisma.event_propertiesUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  event_id: z.string(),
  name: z.string(),
  key: z.string(),
  data_type: z.string().optional(),
  required: z.boolean().optional(),
  allowed_values: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  example_value: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const event_propertiesUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  event_id: z.string(),
  name: z.string(),
  key: z.string(),
  data_type: z.string().optional(),
  required: z.boolean().optional(),
  allowed_values: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  example_value: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
