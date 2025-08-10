import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const UsersMaxAggregateInputObjectSchema: z.ZodType<Prisma.UsersMaxAggregateInputType, Prisma.UsersMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  email: z.literal(true).optional(),
  name: z.literal(true).optional(),
  avatar_url: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional()
}).strict();
export const UsersMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  email: z.literal(true).optional(),
  name: z.literal(true).optional(),
  avatar_url: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional()
}).strict();
