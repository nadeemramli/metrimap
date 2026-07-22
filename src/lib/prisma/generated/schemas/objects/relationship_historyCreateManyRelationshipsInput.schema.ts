// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const relationship_historyCreateManyRelationshipsInputObjectSchema: z.ZodType<Prisma.relationship_historyCreateManyRelationshipsInput, Prisma.relationship_historyCreateManyRelationshipsInput> = z.object({
  id: z.string().optional(),
  project_id: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  confidence: z.string().optional().nullable(),
  weight: z.number().optional().nullable(),
  changed_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
export const relationship_historyCreateManyRelationshipsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  project_id: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  confidence: z.string().optional().nullable(),
  weight: z.number().optional().nullable(),
  changed_by: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional()
}).strict();
