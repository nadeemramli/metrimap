// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Event_definitionsCountAggregateInputObjectSchema: z.ZodType<Prisma.Event_definitionsCountAggregateInputType, Prisma.Event_definitionsCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  name: z.literal(true).optional(),
  key: z.literal(true).optional(),
  category: z.literal(true).optional(),
  description: z.literal(true).optional(),
  lifecycle_state: z.literal(true).optional(),
  source_kind: z.literal(true).optional(),
  owner_label: z.literal(true).optional(),
  tracked_metric_id: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const Event_definitionsCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  name: z.literal(true).optional(),
  key: z.literal(true).optional(),
  category: z.literal(true).optional(),
  description: z.literal(true).optional(),
  lifecycle_state: z.literal(true).optional(),
  source_kind: z.literal(true).optional(),
  owner_label: z.literal(true).optional(),
  tracked_metric_id: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
