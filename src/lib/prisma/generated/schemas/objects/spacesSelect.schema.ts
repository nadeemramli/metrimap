// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProjectsFindManySchema } from '../findManyprojects.schema';
import { spacesCountOutputTypeArgsObjectSchema } from './spacesCountOutputTypeArgs.schema'

export const spacesSelectObjectSchema: z.ZodType<Prisma.spacesSelect, Prisma.spacesSelect> = z.object({
  id: z.boolean().optional(),
  created_by: z.boolean().optional(),
  name: z.boolean().optional(),
  color: z.boolean().optional(),
  sort_order: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  workspace_id: z.boolean().optional(),
  projects: z.union([z.boolean(), z.lazy(() => ProjectsFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => spacesCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const spacesSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  created_by: z.boolean().optional(),
  name: z.boolean().optional(),
  color: z.boolean().optional(),
  sort_order: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  workspace_id: z.boolean().optional(),
  projects: z.union([z.boolean(), z.lazy(() => ProjectsFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => spacesCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
