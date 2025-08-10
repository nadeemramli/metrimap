import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Evidence_itemsCountAggregateInputObjectSchema: z.ZodType<Prisma.Evidence_itemsCountAggregateInputType, Prisma.Evidence_itemsCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  relationship_id: z.literal(true).optional(),
  title: z.literal(true).optional(),
  type: z.literal(true).optional(),
  date: z.literal(true).optional(),
  owner_id: z.literal(true).optional(),
  link: z.literal(true).optional(),
  hypothesis: z.literal(true).optional(),
  summary: z.literal(true).optional(),
  impact_on_confidence: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const Evidence_itemsCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  relationship_id: z.literal(true).optional(),
  title: z.literal(true).optional(),
  type: z.literal(true).optional(),
  date: z.literal(true).optional(),
  owner_id: z.literal(true).optional(),
  link: z.literal(true).optional(),
  hypothesis: z.literal(true).optional(),
  summary: z.literal(true).optional(),
  impact_on_confidence: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
