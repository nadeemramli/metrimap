// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsCreateNestedOneWithoutRelationship_tagsInputObjectSchema } from './tagsCreateNestedOneWithoutRelationship_tagsInput.schema'

export const relationship_tagsCreateWithoutRelationshipsInputObjectSchema: z.ZodType<Prisma.relationship_tagsCreateWithoutRelationshipsInput, Prisma.relationship_tagsCreateWithoutRelationshipsInput> = z.object({
  id: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  tags: z.lazy(() => tagsCreateNestedOneWithoutRelationship_tagsInputObjectSchema).optional()
}).strict();
export const relationship_tagsCreateWithoutRelationshipsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  tags: z.lazy(() => tagsCreateNestedOneWithoutRelationship_tagsInputObjectSchema).optional()
}).strict();
