// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const tagsCreateManyUsersInputObjectSchema: z.ZodType<Prisma.tagsCreateManyUsersInput, Prisma.tagsCreateManyUsersInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  color: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  project_id: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  is_access: z.boolean().optional(),
  redaction_mode: z.string().optional()
}).strict();
export const tagsCreateManyUsersInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  color: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  project_id: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  is_access: z.boolean().optional(),
  redaction_mode: z.string().optional()
}).strict();
