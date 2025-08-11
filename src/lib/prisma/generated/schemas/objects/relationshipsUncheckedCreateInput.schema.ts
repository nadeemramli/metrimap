import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const relationshipsUncheckedCreateInputObjectSchema: z.ZodType<Prisma.relationshipsUncheckedCreateInput, Prisma.relationshipsUncheckedCreateInput> = z.object({
  project_id: z.string().optional().nullable(),
  source_id: z.string().optional().nullable(),
  target_id: z.string().optional().nullable(),
  type: z.string(),
  confidence: z.string().optional(),
  weight: z.number().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  created_by: z.string()
}).strict();
export const relationshipsUncheckedCreateInputObjectZodSchema = z.object({
  project_id: z.string().optional().nullable(),
  source_id: z.string().optional().nullable(),
  target_id: z.string().optional().nullable(),
  type: z.string(),
  confidence: z.string().optional(),
  weight: z.number().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  created_by: z.string()
}).strict();
