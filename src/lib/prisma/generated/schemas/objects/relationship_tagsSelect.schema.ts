import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const relationship_tagsSelectObjectSchema: z.ZodType<Prisma.relationship_tagsSelect, Prisma.relationship_tagsSelect> = z.object({
  id: z.boolean().optional(),
  relationship_id: z.boolean().optional(),
  tag_id: z.boolean().optional(),
  created_at: z.boolean().optional()
}).strict();
export const relationship_tagsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  relationship_id: z.boolean().optional(),
  tag_id: z.boolean().optional(),
  created_at: z.boolean().optional()
}).strict();
