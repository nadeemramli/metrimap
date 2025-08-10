import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const ProjectsCountAggregateInputObjectSchema: z.ZodType<Prisma.ProjectsCountAggregateInputType, Prisma.ProjectsCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  description: z.literal(true).optional(),
  tags: z.literal(true).optional(),
  settings: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  last_modified_by: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  is_public: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const ProjectsCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  description: z.literal(true).optional(),
  tags: z.literal(true).optional(),
  settings: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  last_modified_by: z.literal(true).optional(),
  created_by: z.literal(true).optional(),
  is_public: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
