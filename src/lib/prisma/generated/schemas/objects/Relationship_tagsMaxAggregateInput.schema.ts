import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Relationship_tagsMaxAggregateInputObjectSchema: z.ZodType<Prisma.Relationship_tagsMaxAggregateInputType, Prisma.Relationship_tagsMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  relationship_id: z.literal(true).optional(),
  tag_id: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
export const Relationship_tagsMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  relationship_id: z.literal(true).optional(),
  tag_id: z.literal(true).optional(),
  created_at: z.literal(true).optional()
}).strict();
