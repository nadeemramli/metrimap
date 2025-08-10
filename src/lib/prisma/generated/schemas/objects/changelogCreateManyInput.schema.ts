import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const changelogCreateManyInputObjectSchema: z.ZodType<Prisma.changelogCreateManyInput, Prisma.changelogCreateManyInput> = z.object({
  project_id: z.string().optional().nullable(),
  user_id: z.string().optional().nullable(),
  action: z.string(),
  target: z.string(),
  target_id: z.string().optional().nullable(),
  target_name: z.string(),
  description: z.string(),
  metadata: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  timestamp: z.union([z.date(), z.iso.datetime()]).optional().nullable()
}).strict();
export const changelogCreateManyInputObjectZodSchema = z.object({
  project_id: z.string().optional().nullable(),
  user_id: z.string().optional().nullable(),
  action: z.string(),
  target: z.string(),
  target_id: z.string().optional().nullable(),
  target_name: z.string(),
  description: z.string(),
  metadata: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  timestamp: z.union([z.date(), z.iso.datetime()]).optional().nullable()
}).strict();
