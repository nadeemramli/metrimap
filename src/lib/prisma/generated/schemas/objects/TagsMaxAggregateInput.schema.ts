import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const TagsMaxAggregateInputObjectSchema: z.ZodType<Prisma.TagsMaxAggregateInputType, Prisma.TagsMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  color: z.literal(true).optional(),
  description: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional()
}).strict();
export const TagsMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  color: z.literal(true).optional(),
  description: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional()
}).strict();
