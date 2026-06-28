// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Canvas_nodesMaxAggregateInputObjectSchema: z.ZodType<Prisma.Canvas_nodesMaxAggregateInputType, Prisma.Canvas_nodesMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  node_type: z.literal(true).optional(),
  title: z.literal(true).optional(),
  position_x: z.literal(true).optional(),
  position_y: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  created_by: z.literal(true).optional()
}).strict();
export const Canvas_nodesMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  node_type: z.literal(true).optional(),
  title: z.literal(true).optional(),
  position_x: z.literal(true).optional(),
  position_y: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  created_by: z.literal(true).optional()
}).strict();
