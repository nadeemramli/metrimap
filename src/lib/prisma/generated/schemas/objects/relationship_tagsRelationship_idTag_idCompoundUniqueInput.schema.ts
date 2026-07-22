// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const relationship_tagsRelationship_idTag_idCompoundUniqueInputObjectSchema: z.ZodType<Prisma.relationship_tagsRelationship_idTag_idCompoundUniqueInput, Prisma.relationship_tagsRelationship_idTag_idCompoundUniqueInput> = z.object({
  relationship_id: z.string(),
  tag_id: z.string()
}).strict();
export const relationship_tagsRelationship_idTag_idCompoundUniqueInputObjectZodSchema = z.object({
  relationship_id: z.string(),
  tag_id: z.string()
}).strict();
