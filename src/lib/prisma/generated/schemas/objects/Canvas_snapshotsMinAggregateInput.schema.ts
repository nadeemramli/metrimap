// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Canvas_snapshotsMinAggregateInputObjectSchema: z.ZodType<Prisma.Canvas_snapshotsMinAggregateInputType, Prisma.Canvas_snapshotsMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  canvas_id: z.literal(true).optional(),
  version: z.literal(true).optional(),
  title: z.literal(true).optional(),
  description: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional()
}).strict();
export const Canvas_snapshotsMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  canvas_id: z.literal(true).optional(),
  version: z.literal(true).optional(),
  title: z.literal(true).optional(),
  description: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional()
}).strict();
