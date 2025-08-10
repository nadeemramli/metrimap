import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Relationship_tagsMinAggregateInputObjectSchema: z.ZodType<Prisma.Relationship_tagsMinAggregateInputType, Prisma.Relationship_tagsMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  relationship_id: z.literal(true).optional(),
  tag_id: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
export const Relationship_tagsMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  relationship_id: z.literal(true).optional(),
  tag_id: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
