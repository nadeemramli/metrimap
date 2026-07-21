// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreatetagsInputObjectSchema } from './projectsCreatetagsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'


const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(z.string(), jsonSchema.nullable())])
);

export const projectsCreateManyUsers_projects_last_modified_byTousersInputObjectSchema: z.ZodType<Prisma.projectsCreateManyUsers_projects_last_modified_byTousersInput, Prisma.projectsCreateManyUsers_projects_last_modified_byTousersInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  tags: z.union([z.lazy(() => projectsCreatetagsInputObjectSchema), z.string().array()]).optional(),
  settings: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  created_by: z.string(),
  is_public: z.boolean().optional(),
  is_starred: z.boolean().optional(),
  archived_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  space_id: z.string().optional().nullable(),
  workspace_id: z.string().optional().nullable()
}).strict();
export const projectsCreateManyUsers_projects_last_modified_byTousersInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  tags: z.union([z.lazy(() => projectsCreatetagsInputObjectSchema), z.string().array()]).optional(),
  settings: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  created_by: z.string(),
  is_public: z.boolean().optional(),
  is_starred: z.boolean().optional(),
  archived_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  space_id: z.string().optional().nullable(),
  workspace_id: z.string().optional().nullable()
}).strict();
