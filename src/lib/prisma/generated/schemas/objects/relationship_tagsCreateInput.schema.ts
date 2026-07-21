// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsCreateNestedOneWithoutRelationship_tagsInputObjectSchema } from './relationshipsCreateNestedOneWithoutRelationship_tagsInput.schema';
import { tagsCreateNestedOneWithoutRelationship_tagsInputObjectSchema } from './tagsCreateNestedOneWithoutRelationship_tagsInput.schema'

export const relationship_tagsCreateInputObjectSchema: z.ZodType<Prisma.relationship_tagsCreateInput, Prisma.relationship_tagsCreateInput> = z.object({
  id: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  relationships: z.lazy(() => relationshipsCreateNestedOneWithoutRelationship_tagsInputObjectSchema).optional(),
  tags: z.lazy(() => tagsCreateNestedOneWithoutRelationship_tagsInputObjectSchema).optional()
}).strict();
export const relationship_tagsCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  relationships: z.lazy(() => relationshipsCreateNestedOneWithoutRelationship_tagsInputObjectSchema).optional(),
  tags: z.lazy(() => tagsCreateNestedOneWithoutRelationship_tagsInputObjectSchema).optional()
}).strict();
