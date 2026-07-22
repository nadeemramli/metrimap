// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsArgsObjectSchema } from './projectsArgs.schema';
import { usersArgsObjectSchema } from './usersArgs.schema'

export const project_collaboratorsIncludeObjectSchema: z.ZodType<Prisma.project_collaboratorsInclude, Prisma.project_collaboratorsInclude> = z.object({
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  users: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional()
}).strict();
export const project_collaboratorsIncludeObjectZodSchema = z.object({
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  users: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional()
}).strict();
