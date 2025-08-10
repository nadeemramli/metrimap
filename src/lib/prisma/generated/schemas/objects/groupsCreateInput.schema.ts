import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { groupsCreatenode_idsInputObjectSchema } from './groupsCreatenode_idsInput.schema'

export const groupsCreateInputObjectSchema: z.ZodType<Prisma.groupsCreateInput, Prisma.groupsCreateInput> = z.object({
  project_id: z.string().optional().nullable(),
  name: z.string(),
  description: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  position_x: z.number().optional(),
  position_y: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  node_ids: z.union([z.lazy(() => groupsCreatenode_idsInputObjectSchema), z.string().array()]).optional(),
  created_at: z.union([z.date(), z.iso.datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.iso.datetime()]).optional().nullable(),
  created_by: z.string()
}).strict();
export const groupsCreateInputObjectZodSchema = z.object({
  project_id: z.string().optional().nullable(),
  name: z.string(),
  description: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  position_x: z.number().optional(),
  position_y: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  node_ids: z.union([z.lazy(() => groupsCreatenode_idsInputObjectSchema), z.string().array()]).optional(),
  created_at: z.union([z.date(), z.iso.datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.iso.datetime()]).optional().nullable(),
  created_by: z.string()
}).strict();
