import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const evidence_itemsCreateInputObjectSchema: z.ZodType<Prisma.evidence_itemsCreateInput, Prisma.evidence_itemsCreateInput> = z.object({
  relationship_id: z.string().optional().nullable(),
  title: z.string(),
  type: z.string(),
  date: z.union([z.date(), z.iso.datetime()]),
  owner_id: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  hypothesis: z.string().optional().nullable(),
  summary: z.string(),
  impact_on_confidence: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.iso.datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.iso.datetime()]).optional().nullable(),
  created_by: z.string()
}).strict();
export const evidence_itemsCreateInputObjectZodSchema = z.object({
  relationship_id: z.string().optional().nullable(),
  title: z.string(),
  type: z.string(),
  date: z.union([z.date(), z.iso.datetime()]),
  owner_id: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  hypothesis: z.string().optional().nullable(),
  summary: z.string(),
  impact_on_confidence: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.iso.datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.iso.datetime()]).optional().nullable(),
  created_by: z.string()
}).strict();
