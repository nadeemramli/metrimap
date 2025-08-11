import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const notificationsUncheckedCreateInputObjectSchema: z.ZodType<Prisma.notificationsUncheckedCreateInput, Prisma.notificationsUncheckedCreateInput> = z.object({
  user_id: z.string(),
  type: z.string(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  read: z.boolean().optional(),
  metadata: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const notificationsUncheckedCreateInputObjectZodSchema = z.object({
  user_id: z.string(),
  type: z.string(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  read: z.boolean().optional(),
  metadata: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
