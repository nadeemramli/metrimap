import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsSelectObjectSchema } from './projectsSelect.schema'

export const projectsArgsObjectSchema = z.object({
  select: z.lazy(() => projectsSelectObjectSchema).optional()
}).strict();
export const projectsArgsObjectZodSchema = z.object({
  select: z.lazy(() => projectsSelectObjectSchema).optional()
}).strict();
