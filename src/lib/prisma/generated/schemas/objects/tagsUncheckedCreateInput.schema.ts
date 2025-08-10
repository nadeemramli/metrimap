import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const tagsUncheckedCreateInputObjectSchema: z.ZodType<Prisma.tagsUncheckedCreateInput, Prisma.tagsUncheckedCreateInput> = z.object({
  name: z.string(),
  color: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  project_id: z.string().optional().nullable(),
  created_by: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.iso.datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.iso.datetime()]).optional().nullable()
}).strict();
export const tagsUncheckedCreateInputObjectZodSchema = z.object({
  name: z.string(),
  color: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  project_id: z.string().optional().nullable(),
  created_by: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.iso.datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.iso.datetime()]).optional().nullable()
}).strict();
