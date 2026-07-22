// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsArgsObjectSchema } from './projectsArgs.schema'

export const canvas_nodesSelectObjectSchema: z.ZodType<Prisma.canvas_nodesSelect, Prisma.canvas_nodesSelect> = z.object({
  id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  node_type: z.boolean().optional(),
  title: z.boolean().optional(),
  position_x: z.boolean().optional(),
  position_y: z.boolean().optional(),
  data: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  created_by: z.boolean().optional(),
  updated_by: z.boolean().optional(),
  z_index: z.boolean().optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional()
}).strict();
export const canvas_nodesSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  node_type: z.boolean().optional(),
  title: z.boolean().optional(),
  position_x: z.boolean().optional(),
  position_y: z.boolean().optional(),
  data: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  created_by: z.boolean().optional(),
  updated_by: z.boolean().optional(),
  z_index: z.boolean().optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional()
}).strict();
