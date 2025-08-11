import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const evidence_itemsCreateManyInputObjectSchema: z.ZodType<Prisma.evidence_itemsCreateManyInput, Prisma.evidence_itemsCreateManyInput> = z.object({
  relationship_id: z.string().optional().nullable(),
  title: z.string(),
  type: z.string(),
  date: z.union([z.date(), z.string().datetime()]),
  owner_id: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  hypothesis: z.string().optional().nullable(),
  summary: z.string(),
  impact_on_confidence: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  created_by: z.string()
}).strict();
export const evidence_itemsCreateManyInputObjectZodSchema = z.object({
  relationship_id: z.string().optional().nullable(),
  title: z.string(),
  type: z.string(),
  date: z.union([z.date(), z.string().datetime()]),
  owner_id: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  hypothesis: z.string().optional().nullable(),
  summary: z.string(),
  impact_on_confidence: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  created_by: z.string()
}).strict();
