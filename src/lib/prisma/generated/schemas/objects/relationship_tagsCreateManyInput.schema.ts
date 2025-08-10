import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const relationship_tagsCreateManyInputObjectSchema: z.ZodType<Prisma.relationship_tagsCreateManyInput, Prisma.relationship_tagsCreateManyInput> = z.object({
  relationship_id: z.string().optional().nullable(),
  tag_id: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.iso.datetime()]).optional().nullable()
}).strict();
export const relationship_tagsCreateManyInputObjectZodSchema = z.object({
  relationship_id: z.string().optional().nullable(),
  tag_id: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.iso.datetime()]).optional().nullable()
}).strict();
