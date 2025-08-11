import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const usersCreateInputObjectSchema: z.ZodType<Prisma.usersCreateInput, Prisma.usersCreateInput> = z.object({
  email: z.string(),
  name: z.string(),
  avatar_url: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable()
}).strict();
export const usersCreateInputObjectZodSchema = z.object({
  email: z.string(),
  name: z.string(),
  avatar_url: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable()
}).strict();
