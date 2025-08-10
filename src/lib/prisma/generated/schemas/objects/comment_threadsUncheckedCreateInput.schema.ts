import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const comment_threadsUncheckedCreateInputObjectSchema: z.ZodType<Prisma.comment_threadsUncheckedCreateInput, Prisma.comment_threadsUncheckedCreateInput> = z.object({
  project_id: z.string(),
  source: z.string(),
  context: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  is_resolved: z.boolean().optional(),
  created_by: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.iso.datetime()]).optional(),
  updated_at: z.union([z.date(), z.iso.datetime()]).optional()
}).strict();
export const comment_threadsUncheckedCreateInputObjectZodSchema = z.object({
  project_id: z.string(),
  source: z.string(),
  context: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  is_resolved: z.boolean().optional(),
  created_by: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.iso.datetime()]).optional(),
  updated_at: z.union([z.date(), z.iso.datetime()]).optional()
}).strict();
