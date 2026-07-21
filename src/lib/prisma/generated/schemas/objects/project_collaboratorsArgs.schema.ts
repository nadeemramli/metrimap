// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { project_collaboratorsSelectObjectSchema } from './project_collaboratorsSelect.schema';
import { project_collaboratorsIncludeObjectSchema } from './project_collaboratorsInclude.schema'

export const project_collaboratorsArgsObjectSchema = z.object({
  select: z.lazy(() => project_collaboratorsSelectObjectSchema).optional(),
  include: z.lazy(() => project_collaboratorsIncludeObjectSchema).optional()
}).strict();
export const project_collaboratorsArgsObjectZodSchema = z.object({
  select: z.lazy(() => project_collaboratorsSelectObjectSchema).optional(),
  include: z.lazy(() => project_collaboratorsIncludeObjectSchema).optional()
}).strict();
