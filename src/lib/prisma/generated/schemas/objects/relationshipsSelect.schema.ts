import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const relationshipsSelectObjectSchema: z.ZodType<Prisma.relationshipsSelect, Prisma.relationshipsSelect> = z.object({
  id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  source_id: z.boolean().optional(),
  target_id: z.boolean().optional(),
  type: z.boolean().optional(),
  confidence: z.boolean().optional(),
  weight: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  created_by: z.boolean().optional()
}).strict();
export const relationshipsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  source_id: z.boolean().optional(),
  target_id: z.boolean().optional(),
  type: z.boolean().optional(),
  confidence: z.boolean().optional(),
  weight: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  created_by: z.boolean().optional()
}).strict();
