// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { commentsUncheckedCreateNestedManyWithoutComment_threadsInputObjectSchema } from './commentsUncheckedCreateNestedManyWithoutComment_threadsInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const comment_threadsUncheckedCreateWithoutProjectsInputObjectSchema: z.ZodType<Prisma.comment_threadsUncheckedCreateWithoutProjectsInput, Prisma.comment_threadsUncheckedCreateWithoutProjectsInput> = z.object({
  id: z.string().optional(),
  source: z.string(),
  context: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  is_resolved: z.boolean().optional(),
  created_by: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  comments: z.lazy(() => commentsUncheckedCreateNestedManyWithoutComment_threadsInputObjectSchema).optional()
}).strict();
export const comment_threadsUncheckedCreateWithoutProjectsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  source: z.string(),
  context: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  is_resolved: z.boolean().optional(),
  created_by: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  comments: z.lazy(() => commentsUncheckedCreateNestedManyWithoutComment_threadsInputObjectSchema).optional()
}).strict();
