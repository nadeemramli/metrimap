import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const tagsCreateInputObjectSchema: z.ZodType<Prisma.tagsCreateInput, Prisma.tagsCreateInput> = z.object({
  name: z.string(),
  color: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  project_id: z.string().optional().nullable(),
  created_by: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.iso.datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.iso.datetime()]).optional().nullable()
}).strict();
export const tagsCreateInputObjectZodSchema = z.object({
  name: z.string(),
  color: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  project_id: z.string().optional().nullable(),
  created_by: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.iso.datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.iso.datetime()]).optional().nullable()
}).strict();
