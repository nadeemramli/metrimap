// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const relationship_tagsCreateManyRelationshipsInputObjectSchema: z.ZodType<Prisma.relationship_tagsCreateManyRelationshipsInput, Prisma.relationship_tagsCreateManyRelationshipsInput> = z.object({
  id: z.string().optional(),
  tag_id: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable()
}).strict();
export const relationship_tagsCreateManyRelationshipsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  tag_id: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable()
}).strict();
