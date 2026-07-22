// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersArgsObjectSchema } from './usersArgs.schema';
import { projectsArgsObjectSchema } from './projectsArgs.schema'

export const groupsIncludeObjectSchema: z.ZodType<Prisma.groupsInclude, Prisma.groupsInclude> = z.object({
  users: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional()
}).strict();
export const groupsIncludeObjectZodSchema = z.object({
  users: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional()
}).strict();
