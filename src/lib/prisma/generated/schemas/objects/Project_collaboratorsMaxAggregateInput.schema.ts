import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Project_collaboratorsMaxAggregateInputObjectSchema: z.ZodType<Prisma.Project_collaboratorsMaxAggregateInputType, Prisma.Project_collaboratorsMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  user_id: z.literal(true).optional(),
  role: z.literal(true).optional(),
  invited_at: z.literal(true).optional(),
  joined_at: z.literal(true).optional()
}).strict();
export const Project_collaboratorsMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  user_id: z.literal(true).optional(),
  role: z.literal(true).optional(),
  invited_at: z.literal(true).optional(),
  joined_at: z.literal(true).optional()
}).strict();
