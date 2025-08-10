import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const usersSelectObjectSchema: z.ZodType<Prisma.usersSelect, Prisma.usersSelect> = z.object({
  id: z.boolean().optional(),
  email: z.boolean().optional(),
  name: z.boolean().optional(),
  avatar_url: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional()
}).strict();
export const usersSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  email: z.boolean().optional(),
  name: z.boolean().optional(),
  avatar_url: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional()
}).strict();
