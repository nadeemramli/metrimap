// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { project_collaboratorsCreatepermissionsInputObjectSchema } from './project_collaboratorsCreatepermissionsInput.schema';
import { projectsCreateNestedOneWithoutProject_collaboratorsInputObjectSchema } from './projectsCreateNestedOneWithoutProject_collaboratorsInput.schema';
import { usersCreateNestedOneWithoutProject_collaboratorsInputObjectSchema } from './usersCreateNestedOneWithoutProject_collaboratorsInput.schema'

export const project_collaboratorsCreateInputObjectSchema: z.ZodType<Prisma.project_collaboratorsCreateInput, Prisma.project_collaboratorsCreateInput> = z.object({
  id: z.string().optional(),
  role: z.string().optional(),
  permissions: z.union([z.lazy(() => project_collaboratorsCreatepermissionsInputObjectSchema), z.string().array()]).optional(),
  invited_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  joined_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  projects: z.lazy(() => projectsCreateNestedOneWithoutProject_collaboratorsInputObjectSchema).optional(),
  users: z.lazy(() => usersCreateNestedOneWithoutProject_collaboratorsInputObjectSchema).optional()
}).strict();
export const project_collaboratorsCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  role: z.string().optional(),
  permissions: z.union([z.lazy(() => project_collaboratorsCreatepermissionsInputObjectSchema), z.string().array()]).optional(),
  invited_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  joined_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  projects: z.lazy(() => projectsCreateNestedOneWithoutProject_collaboratorsInputObjectSchema).optional(),
  users: z.lazy(() => usersCreateNestedOneWithoutProject_collaboratorsInputObjectSchema).optional()
}).strict();
