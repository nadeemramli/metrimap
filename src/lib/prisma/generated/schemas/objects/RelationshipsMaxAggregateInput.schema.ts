import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const RelationshipsMaxAggregateInputObjectSchema: z.ZodType<Prisma.RelationshipsMaxAggregateInputType, Prisma.RelationshipsMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  source_id: z.literal(true).optional(),
  target_id: z.literal(true).optional(),
  type: z.literal(true).optional(),
  confidence: z.literal(true).optional(),
  weight: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  created_by: z.literal(true).optional()
}).strict();
export const RelationshipsMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  source_id: z.literal(true).optional(),
  target_id: z.literal(true).optional(),
  type: z.literal(true).optional(),
  confidence: z.literal(true).optional(),
  weight: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  created_by: z.literal(true).optional()
}).strict();
