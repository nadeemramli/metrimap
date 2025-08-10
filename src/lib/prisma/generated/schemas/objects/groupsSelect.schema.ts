import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const groupsSelectObjectSchema: z.ZodType<Prisma.groupsSelect, Prisma.groupsSelect> = z.object({
  id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  color: z.boolean().optional(),
  position_x: z.boolean().optional(),
  position_y: z.boolean().optional(),
  width: z.boolean().optional(),
  height: z.boolean().optional(),
  node_ids: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  created_by: z.boolean().optional()
}).strict();
export const groupsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  color: z.boolean().optional(),
  position_x: z.boolean().optional(),
  position_y: z.boolean().optional(),
  width: z.boolean().optional(),
  height: z.boolean().optional(),
  node_ids: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  created_by: z.boolean().optional()
}).strict();
