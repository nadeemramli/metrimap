import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreatetagsInputObjectSchema } from './projectsCreatetagsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const projectsCreateInputObjectSchema: z.ZodType<Prisma.projectsCreateInput, Prisma.projectsCreateInput> = z.object({
  name: z.string(),
  description: z.string().optional().nullable(),
  tags: z.union([z.lazy(() => projectsCreatetagsInputObjectSchema), z.string().array()]).optional(),
  settings: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  created_at: z.union([z.date(), z.iso.datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.iso.datetime()]).optional().nullable(),
  last_modified_by: z.string().optional().nullable(),
  created_by: z.string(),
  is_public: z.boolean().optional()
}).strict();
export const projectsCreateInputObjectZodSchema = z.object({
  name: z.string(),
  description: z.string().optional().nullable(),
  tags: z.union([z.lazy(() => projectsCreatetagsInputObjectSchema), z.string().array()]).optional(),
  settings: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  created_at: z.union([z.date(), z.iso.datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.iso.datetime()]).optional().nullable(),
  last_modified_by: z.string().optional().nullable(),
  created_by: z.string(),
  is_public: z.boolean().optional()
}).strict();
