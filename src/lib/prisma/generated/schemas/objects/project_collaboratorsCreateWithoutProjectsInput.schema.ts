// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { project_collaboratorsCreatepermissionsInputObjectSchema } from './project_collaboratorsCreatepermissionsInput.schema';
import { usersCreateNestedOneWithoutProject_collaboratorsInputObjectSchema } from './usersCreateNestedOneWithoutProject_collaboratorsInput.schema'

export const project_collaboratorsCreateWithoutProjectsInputObjectSchema: z.ZodType<Prisma.project_collaboratorsCreateWithoutProjectsInput, Prisma.project_collaboratorsCreateWithoutProjectsInput> = z.object({
  id: z.string().optional(),
  role: z.string().optional(),
  permissions: z.union([z.lazy(() => project_collaboratorsCreatepermissionsInputObjectSchema), z.string().array()]).optional(),
  invited_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  joined_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  users: z.lazy(() => usersCreateNestedOneWithoutProject_collaboratorsInputObjectSchema).optional()
}).strict();
export const project_collaboratorsCreateWithoutProjectsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  role: z.string().optional(),
  permissions: z.union([z.lazy(() => project_collaboratorsCreatepermissionsInputObjectSchema), z.string().array()]).optional(),
  invited_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  joined_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  users: z.lazy(() => usersCreateNestedOneWithoutProject_collaboratorsInputObjectSchema).optional()
}).strict();
