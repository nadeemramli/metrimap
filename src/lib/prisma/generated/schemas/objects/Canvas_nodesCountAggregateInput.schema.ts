// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Canvas_nodesCountAggregateInputObjectSchema: z.ZodType<Prisma.Canvas_nodesCountAggregateInputType, Prisma.Canvas_nodesCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  node_type: z.literal(true).optional(),
  title: z.literal(true).optional(),
  position_x: z.literal(true).optional(),
  position_y: z.literal(true).optional(),
  data: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  updated_by: z.literal(true).optional(),
  z_index: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const Canvas_nodesCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  node_type: z.literal(true).optional(),
  title: z.literal(true).optional(),
  position_x: z.literal(true).optional(),
  position_y: z.literal(true).optional(),
  data: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  updated_by: z.literal(true).optional(),
  z_index: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
