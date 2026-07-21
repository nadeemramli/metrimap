// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsArgsObjectSchema } from './projectsArgs.schema';
import { relationshipsArgsObjectSchema } from './relationshipsArgs.schema'

export const relationship_historySelectObjectSchema: z.ZodType<Prisma.relationship_historySelect, Prisma.relationship_historySelect> = z.object({
  id: z.boolean().optional(),
  relationship_id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  type: z.boolean().optional(),
  confidence: z.boolean().optional(),
  weight: z.boolean().optional(),
  changed_by: z.boolean().optional(),
  created_at: z.boolean().optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  relationships: z.union([z.boolean(), z.lazy(() => relationshipsArgsObjectSchema)]).optional()
}).strict();
export const relationship_historySelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  relationship_id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  type: z.boolean().optional(),
  confidence: z.boolean().optional(),
  weight: z.boolean().optional(),
  changed_by: z.boolean().optional(),
  created_at: z.boolean().optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  relationships: z.union([z.boolean(), z.lazy(() => relationshipsArgsObjectSchema)]).optional()
}).strict();
