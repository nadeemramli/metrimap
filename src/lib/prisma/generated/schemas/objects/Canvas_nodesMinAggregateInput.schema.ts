// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Canvas_nodesMinAggregateInputObjectSchema: z.ZodType<Prisma.Canvas_nodesMinAggregateInputType, Prisma.Canvas_nodesMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  node_type: z.literal(true).optional(),
  title: z.literal(true).optional(),
  position_x: z.literal(true).optional(),
  position_y: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  updated_by: z.literal(true).optional(),
  z_index: z.literal(true).optional()
}).strict();
export const Canvas_nodesMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  node_type: z.literal(true).optional(),
  title: z.literal(true).optional(),
  position_x: z.literal(true).optional(),
  position_y: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  updated_by: z.literal(true).optional(),
  z_index: z.literal(true).optional()
}).strict();
