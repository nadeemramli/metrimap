// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsCreateNestedOneWithoutRelationship_tagsInputObjectSchema } from './relationshipsCreateNestedOneWithoutRelationship_tagsInput.schema'

export const relationship_tagsCreateWithoutTagsInputObjectSchema: z.ZodType<Prisma.relationship_tagsCreateWithoutTagsInput, Prisma.relationship_tagsCreateWithoutTagsInput> = z.object({
  id: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  relationships: z.lazy(() => relationshipsCreateNestedOneWithoutRelationship_tagsInputObjectSchema).optional()
}).strict();
export const relationship_tagsCreateWithoutTagsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  relationships: z.lazy(() => relationshipsCreateNestedOneWithoutRelationship_tagsInputObjectSchema).optional()
}).strict();
