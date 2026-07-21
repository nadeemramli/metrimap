// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProjectsFindManySchema } from '../findManyprojects.schema';
import { spacesCountOutputTypeArgsObjectSchema } from './spacesCountOutputTypeArgs.schema'

export const spacesIncludeObjectSchema: z.ZodType<Prisma.spacesInclude, Prisma.spacesInclude> = z.object({
  projects: z.union([z.boolean(), z.lazy(() => ProjectsFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => spacesCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const spacesIncludeObjectZodSchema = z.object({
  projects: z.union([z.boolean(), z.lazy(() => ProjectsFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => spacesCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
