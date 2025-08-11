import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { project_collaboratorsCreatepermissionsInputObjectSchema } from './project_collaboratorsCreatepermissionsInput.schema'

export const project_collaboratorsCreateInputObjectSchema: z.ZodType<Prisma.project_collaboratorsCreateInput, Prisma.project_collaboratorsCreateInput> = z.object({
  project_id: z.string().optional().nullable(),
  user_id: z.string().optional().nullable(),
  role: z.string().optional(),
  permissions: z.union([z.lazy(() => project_collaboratorsCreatepermissionsInputObjectSchema), z.string().array()]).optional(),
  invited_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  joined_at: z.union([z.date(), z.string().datetime()]).optional().nullable()
}).strict();
export const project_collaboratorsCreateInputObjectZodSchema = z.object({
  project_id: z.string().optional().nullable(),
  user_id: z.string().optional().nullable(),
  role: z.string().optional(),
  permissions: z.union([z.lazy(() => project_collaboratorsCreatepermissionsInputObjectSchema), z.string().array()]).optional(),
  invited_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  joined_at: z.union([z.date(), z.string().datetime()]).optional().nullable()
}).strict();
