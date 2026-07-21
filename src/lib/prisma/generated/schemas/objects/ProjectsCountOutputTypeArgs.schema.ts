// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProjectsCountOutputTypeSelectObjectSchema } from './ProjectsCountOutputTypeSelect.schema'

export const ProjectsCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => ProjectsCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const ProjectsCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => ProjectsCountOutputTypeSelectObjectSchema).optional()
}).strict();
