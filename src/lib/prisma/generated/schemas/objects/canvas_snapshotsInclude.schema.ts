// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsArgsObjectSchema } from './projectsArgs.schema'

export const canvas_snapshotsIncludeObjectSchema: z.ZodType<Prisma.canvas_snapshotsInclude, Prisma.canvas_snapshotsInclude> = z.object({
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional()
}).strict();
export const canvas_snapshotsIncludeObjectZodSchema = z.object({
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional()
}).strict();
