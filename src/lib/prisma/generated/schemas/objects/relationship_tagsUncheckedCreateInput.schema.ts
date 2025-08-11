import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const relationship_tagsUncheckedCreateInputObjectSchema: z.ZodType<Prisma.relationship_tagsUncheckedCreateInput, Prisma.relationship_tagsUncheckedCreateInput> = z.object({
  relationship_id: z.string().optional().nullable(),
  tag_id: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable()
}).strict();
export const relationship_tagsUncheckedCreateInputObjectZodSchema = z.object({
  relationship_id: z.string().optional().nullable(),
  tag_id: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable()
}).strict();
