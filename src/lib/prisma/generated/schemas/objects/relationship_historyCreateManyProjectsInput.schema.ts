// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const relationship_historyCreateManyProjectsInputObjectSchema: z.ZodType<Prisma.relationship_historyCreateManyProjectsInput, Prisma.relationship_historyCreateManyProjectsInput> = z.object({
  id: z.string().optional(),
  relationship_id: z.string(),
  type: z.string().optional().nullable(),
  confidence: z.string().optional().nullable(),
  weight: z.number().optional().nullable(),
  changed_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const relationship_historyCreateManyProjectsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  relationship_id: z.string(),
  type: z.string().optional().nullable(),
  confidence: z.string().optional().nullable(),
  weight: z.number().optional().nullable(),
  changed_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
