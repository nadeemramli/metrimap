// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { projectsCreateNestedOneWithoutComment_threadsInputObjectSchema } from './projectsCreateNestedOneWithoutComment_threadsInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const comment_threadsCreateWithoutCommentsInputObjectSchema: z.ZodType<Prisma.comment_threadsCreateWithoutCommentsInput, Prisma.comment_threadsCreateWithoutCommentsInput> = z.object({
  id: z.string().optional(),
  source: z.string(),
  context: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  is_resolved: z.boolean().optional(),
  created_by: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  projects: z.lazy(() => projectsCreateNestedOneWithoutComment_threadsInputObjectSchema)
}).strict();
export const comment_threadsCreateWithoutCommentsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  source: z.string(),
  context: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  is_resolved: z.boolean().optional(),
  created_by: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  projects: z.lazy(() => projectsCreateNestedOneWithoutComment_threadsInputObjectSchema)
}).strict();
