// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsArgsObjectSchema } from './projectsArgs.schema'

export const dashboard_widgetsSelectObjectSchema: z.ZodType<Prisma.dashboard_widgetsSelect, Prisma.dashboard_widgetsSelect> = z.object({
  id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  title: z.boolean().optional(),
  widget_type: z.boolean().optional(),
  config: z.boolean().optional(),
  layout: z.boolean().optional(),
  sort_index: z.boolean().optional(),
  created_by: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  group_id: z.boolean().optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional()
}).strict();
export const dashboard_widgetsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  title: z.boolean().optional(),
  widget_type: z.boolean().optional(),
  config: z.boolean().optional(),
  layout: z.boolean().optional(),
  sort_index: z.boolean().optional(),
  created_by: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  group_id: z.boolean().optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional()
}).strict();
