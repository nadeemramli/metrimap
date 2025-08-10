import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const relationshipsCreateManyInputObjectSchema: z.ZodType<Prisma.relationshipsCreateManyInput, Prisma.relationshipsCreateManyInput> = z.object({
  project_id: z.string().optional().nullable(),
  source_id: z.string().optional().nullable(),
  target_id: z.string().optional().nullable(),
  type: z.string(),
  confidence: z.string().optional(),
  weight: z.number().optional().nullable(),
  created_at: z.union([z.date(), z.iso.datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.iso.datetime()]).optional().nullable(),
  created_by: z.string()
}).strict();
export const relationshipsCreateManyInputObjectZodSchema = z.object({
  project_id: z.string().optional().nullable(),
  source_id: z.string().optional().nullable(),
  target_id: z.string().optional().nullable(),
  type: z.string(),
  confidence: z.string().optional(),
  weight: z.number().optional().nullable(),
  created_at: z.union([z.date(), z.iso.datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.iso.datetime()]).optional().nullable(),
  created_by: z.string()
}).strict();
