import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const ChangelogCountAggregateInputObjectSchema: z.ZodType<Prisma.ChangelogCountAggregateInputType, Prisma.ChangelogCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  user_id: z.literal(true).optional(),
  action: z.literal(true).optional(),
  target: z.literal(true).optional(),
  target_id: z.literal(true).optional(),
  target_name: z.literal(true).optional(),
  description: z.literal(true).optional(),
  metadata: z.literal(true).optional(),
  timestamp: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const ChangelogCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  user_id: z.literal(true).optional(),
  action: z.literal(true).optional(),
  target: z.literal(true).optional(),
  target_id: z.literal(true).optional(),
  target_name: z.literal(true).optional(),
  description: z.literal(true).optional(),
  metadata: z.literal(true).optional(),
  timestamp: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
