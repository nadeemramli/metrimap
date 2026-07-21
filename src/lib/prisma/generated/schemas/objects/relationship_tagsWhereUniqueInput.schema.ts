// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_tagsRelationship_idTag_idCompoundUniqueInputObjectSchema } from './relationship_tagsRelationship_idTag_idCompoundUniqueInput.schema'

export const relationship_tagsWhereUniqueInputObjectSchema: z.ZodType<Prisma.relationship_tagsWhereUniqueInput, Prisma.relationship_tagsWhereUniqueInput> = z.object({
  id: z.string(),
  relationship_id_tag_id: z.lazy(() => relationship_tagsRelationship_idTag_idCompoundUniqueInputObjectSchema)
}).strict();
export const relationship_tagsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string(),
  relationship_id_tag_id: z.lazy(() => relationship_tagsRelationship_idTag_idCompoundUniqueInputObjectSchema)
}).strict();
