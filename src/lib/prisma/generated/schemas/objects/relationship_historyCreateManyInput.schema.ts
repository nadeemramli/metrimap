// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const relationship_historyCreateManyInputObjectSchema: z.ZodType<Prisma.relationship_historyCreateManyInput, Prisma.relationship_historyCreateManyInput> = z.object({
  id: z.string().optional(),
  relationship_id: z.string(),
  project_id: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  confidence: z.string().optional().nullable(),
  weight: z.number().optional().nullable(),
  changed_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const relationship_historyCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  relationship_id: z.string(),
  project_id: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  confidence: z.string().optional().nullable(),
  weight: z.number().optional().nullable(),
  changed_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
