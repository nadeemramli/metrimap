// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Relationship_historyMaxAggregateInputObjectSchema: z.ZodType<Prisma.Relationship_historyMaxAggregateInputType, Prisma.Relationship_historyMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  relationship_id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  type: z.literal(true).optional(),
  confidence: z.literal(true).optional(),
  weight: z.literal(true).optional(),
  changed_by: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
export const Relationship_historyMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  relationship_id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  type: z.literal(true).optional(),
  confidence: z.literal(true).optional(),
  weight: z.literal(true).optional(),
  changed_by: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
