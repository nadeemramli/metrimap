import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Relationship_tagsCountAggregateInputObjectSchema: z.ZodType<Prisma.Relationship_tagsCountAggregateInputType, Prisma.Relationship_tagsCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  relationship_id: z.literal(true).optional(),
  tag_id: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const Relationship_tagsCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  relationship_id: z.literal(true).optional(),
  tag_id: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
