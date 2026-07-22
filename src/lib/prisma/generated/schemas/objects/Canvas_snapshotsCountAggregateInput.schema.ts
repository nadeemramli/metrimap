// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Canvas_snapshotsCountAggregateInputObjectSchema: z.ZodType<Prisma.Canvas_snapshotsCountAggregateInputType, Prisma.Canvas_snapshotsCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  canvas_id: z.literal(true).optional(),
  version: z.literal(true).optional(),
  title: z.literal(true).optional(),
  description: z.literal(true).optional(),
  nodes: z.literal(true).optional(),
  edges: z.literal(true).optional(),
  groups: z.literal(true).optional(),
  metadata: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const Canvas_snapshotsCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  canvas_id: z.literal(true).optional(),
  version: z.literal(true).optional(),
  title: z.literal(true).optional(),
  description: z.literal(true).optional(),
  nodes: z.literal(true).optional(),
  edges: z.literal(true).optional(),
  groups: z.literal(true).optional(),
  metadata: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
