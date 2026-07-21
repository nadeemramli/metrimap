// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_tagsCreateManyRelationshipsInputObjectSchema } from './relationship_tagsCreateManyRelationshipsInput.schema'

export const relationship_tagsCreateManyRelationshipsInputEnvelopeObjectSchema: z.ZodType<Prisma.relationship_tagsCreateManyRelationshipsInputEnvelope, Prisma.relationship_tagsCreateManyRelationshipsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => relationship_tagsCreateManyRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsCreateManyRelationshipsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const relationship_tagsCreateManyRelationshipsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => relationship_tagsCreateManyRelationshipsInputObjectSchema), z.lazy(() => relationship_tagsCreateManyRelationshipsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
