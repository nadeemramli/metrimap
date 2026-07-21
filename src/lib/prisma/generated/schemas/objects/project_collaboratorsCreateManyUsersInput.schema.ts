// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { project_collaboratorsCreatepermissionsInputObjectSchema } from './project_collaboratorsCreatepermissionsInput.schema'

export const project_collaboratorsCreateManyUsersInputObjectSchema: z.ZodType<Prisma.project_collaboratorsCreateManyUsersInput, Prisma.project_collaboratorsCreateManyUsersInput> = z.object({
  id: z.string().optional(),
  project_id: z.string().optional().nullable(),
  role: z.string().optional(),
  permissions: z.union([z.lazy(() => project_collaboratorsCreatepermissionsInputObjectSchema), z.string().array()]).optional(),
  invited_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  joined_at: z.union([z.date(), z.string().datetime()]).optional().nullable()
}).strict();
export const project_collaboratorsCreateManyUsersInputObjectZodSchema = z.object({
  id: z.string().optional(),
  project_id: z.string().optional().nullable(),
  role: z.string().optional(),
  permissions: z.union([z.lazy(() => project_collaboratorsCreatepermissionsInputObjectSchema), z.string().array()]).optional(),
  invited_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  joined_at: z.union([z.date(), z.string().datetime()]).optional().nullable()
}).strict();
