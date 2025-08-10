import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Comment_threadsMinAggregateInputObjectSchema: z.ZodType<Prisma.Comment_threadsMinAggregateInputType, Prisma.Comment_threadsMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  source: z.literal(true).optional(),
  is_resolved: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional()
}).strict();
export const Comment_threadsMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  source: z.literal(true).optional(),
  is_resolved: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional()
}).strict();
