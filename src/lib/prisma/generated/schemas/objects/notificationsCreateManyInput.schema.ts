import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const notificationsCreateManyInputObjectSchema: z.ZodType<Prisma.notificationsCreateManyInput, Prisma.notificationsCreateManyInput> = z.object({
  user_id: z.string(),
  type: z.string(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  read: z.boolean().optional(),
  metadata: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  created_at: z.union([z.date(), z.iso.datetime()]).optional()
}).strict();
export const notificationsCreateManyInputObjectZodSchema = z.object({
  user_id: z.string(),
  type: z.string(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  read: z.boolean().optional(),
  metadata: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  created_at: z.union([z.date(), z.iso.datetime()]).optional()
}).strict();
