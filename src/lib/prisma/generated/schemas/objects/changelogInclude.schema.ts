// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsArgsObjectSchema } from './projectsArgs.schema';
import { usersArgsObjectSchema } from './usersArgs.schema'

export const changelogIncludeObjectSchema: z.ZodType<Prisma.changelogInclude, Prisma.changelogInclude> = z.object({
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  users: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional()
}).strict();
export const changelogIncludeObjectZodSchema = z.object({
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  users: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional()
}).strict();
