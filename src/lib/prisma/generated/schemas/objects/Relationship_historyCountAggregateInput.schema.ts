// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Relationship_historyCountAggregateInputObjectSchema: z.ZodType<Prisma.Relationship_historyCountAggregateInputType, Prisma.Relationship_historyCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  relationship_id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  type: z.literal(true).optional(),
  confidence: z.literal(true).optional(),
  weight: z.literal(true).optional(),
  changed_by: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const Relationship_historyCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  relationship_id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  type: z.literal(true).optional(),
  confidence: z.literal(true).optional(),
  weight: z.literal(true).optional(),
  changed_by: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
