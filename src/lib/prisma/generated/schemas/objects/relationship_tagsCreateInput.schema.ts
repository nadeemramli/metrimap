import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const relationship_tagsCreateInputObjectSchema: z.ZodType<Prisma.relationship_tagsCreateInput, Prisma.relationship_tagsCreateInput> = z.object({
  relationship_id: z.string().optional().nullable(),
  tag_id: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable()
}).strict();
export const relationship_tagsCreateInputObjectZodSchema = z.object({
  relationship_id: z.string().optional().nullable(),
  tag_id: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable()
}).strict();
