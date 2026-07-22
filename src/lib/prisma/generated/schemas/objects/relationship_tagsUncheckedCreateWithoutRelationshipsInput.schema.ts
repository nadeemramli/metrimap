// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const relationship_tagsUncheckedCreateWithoutRelationshipsInputObjectSchema: z.ZodType<Prisma.relationship_tagsUncheckedCreateWithoutRelationshipsInput, Prisma.relationship_tagsUncheckedCreateWithoutRelationshipsInput> = z.object({
  id: z.string().optional(),
  tag_id: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable()
}).strict();
export const relationship_tagsUncheckedCreateWithoutRelationshipsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  tag_id: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable()
}).strict();
