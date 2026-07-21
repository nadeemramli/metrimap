// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const tagsCreateManyProjectsInputObjectSchema: z.ZodType<Prisma.tagsCreateManyProjectsInput, Prisma.tagsCreateManyProjectsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  color: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  created_by: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  is_access: z.boolean().optional(),
  redaction_mode: z.string().optional()
}).strict();
export const tagsCreateManyProjectsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  color: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  created_by: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  is_access: z.boolean().optional(),
  redaction_mode: z.string().optional()
}).strict();
