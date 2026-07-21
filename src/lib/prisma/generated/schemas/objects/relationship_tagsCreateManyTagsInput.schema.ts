// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const relationship_tagsCreateManyTagsInputObjectSchema: z.ZodType<Prisma.relationship_tagsCreateManyTagsInput, Prisma.relationship_tagsCreateManyTagsInput> = z.object({
  id: z.string().optional(),
  relationship_id: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable()
}).strict();
export const relationship_tagsCreateManyTagsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  relationship_id: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable()
}).strict();
