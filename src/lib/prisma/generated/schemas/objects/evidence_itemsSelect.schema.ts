import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const evidence_itemsSelectObjectSchema: z.ZodType<Prisma.evidence_itemsSelect, Prisma.evidence_itemsSelect> = z.object({
  id: z.boolean().optional(),
  relationship_id: z.boolean().optional(),
  title: z.boolean().optional(),
  type: z.boolean().optional(),
  date: z.boolean().optional(),
  owner_id: z.boolean().optional(),
  link: z.boolean().optional(),
  hypothesis: z.boolean().optional(),
  summary: z.boolean().optional(),
  impact_on_confidence: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  created_by: z.boolean().optional()
}).strict();
export const evidence_itemsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  relationship_id: z.boolean().optional(),
  title: z.boolean().optional(),
  type: z.boolean().optional(),
  date: z.boolean().optional(),
  owner_id: z.boolean().optional(),
  link: z.boolean().optional(),
  hypothesis: z.boolean().optional(),
  summary: z.boolean().optional(),
  impact_on_confidence: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  created_by: z.boolean().optional()
}).strict();
