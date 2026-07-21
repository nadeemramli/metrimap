// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsSelectObjectSchema } from './projectsSelect.schema';
import { projectsIncludeObjectSchema } from './projectsInclude.schema'

export const projectsArgsObjectSchema = z.object({
  select: z.lazy(() => projectsSelectObjectSchema).optional(),
  include: z.lazy(() => projectsIncludeObjectSchema).optional()
}).strict();
export const projectsArgsObjectZodSchema = z.object({
  select: z.lazy(() => projectsSelectObjectSchema).optional(),
  include: z.lazy(() => projectsIncludeObjectSchema).optional()
}).strict();
