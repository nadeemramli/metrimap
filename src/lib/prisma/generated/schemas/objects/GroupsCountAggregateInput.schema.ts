import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const GroupsCountAggregateInputObjectSchema: z.ZodType<Prisma.GroupsCountAggregateInputType, Prisma.GroupsCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  description: z.literal(true).optional(),
  color: z.literal(true).optional(),
  position_x: z.literal(true).optional(),
  position_y: z.literal(true).optional(),
  width: z.literal(true).optional(),
  height: z.literal(true).optional(),
  node_ids: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const GroupsCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  description: z.literal(true).optional(),
  color: z.literal(true).optional(),
  position_x: z.literal(true).optional(),
  position_y: z.literal(true).optional(),
  width: z.literal(true).optional(),
  height: z.literal(true).optional(),
  node_ids: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
