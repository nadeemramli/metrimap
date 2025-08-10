import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { project_collaboratorsSelectObjectSchema } from './project_collaboratorsSelect.schema'

export const project_collaboratorsArgsObjectSchema = z.object({
  select: z.lazy(() => project_collaboratorsSelectObjectSchema).optional()
}).strict();
export const project_collaboratorsArgsObjectZodSchema = z.object({
  select: z.lazy(() => project_collaboratorsSelectObjectSchema).optional()
}).strict();
