// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsArgsObjectSchema } from './projectsArgs.schema'

export const canvas_snapshotsSelectObjectSchema: z.ZodType<Prisma.canvas_snapshotsSelect, Prisma.canvas_snapshotsSelect> = z.object({
  id: z.boolean().optional(),
  canvas_id: z.boolean().optional(),
  version: z.boolean().optional(),
  title: z.boolean().optional(),
  description: z.boolean().optional(),
  nodes: z.boolean().optional(),
  edges: z.boolean().optional(),
  groups: z.boolean().optional(),
  metadata: z.boolean().optional(),
  created_by: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional()
}).strict();
export const canvas_snapshotsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  canvas_id: z.boolean().optional(),
  version: z.boolean().optional(),
  title: z.boolean().optional(),
  description: z.boolean().optional(),
  nodes: z.boolean().optional(),
  edges: z.boolean().optional(),
  groups: z.boolean().optional(),
  metadata: z.boolean().optional(),
  created_by: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional()
}).strict();
