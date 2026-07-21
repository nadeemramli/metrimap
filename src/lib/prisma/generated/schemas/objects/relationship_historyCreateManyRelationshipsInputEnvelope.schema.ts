// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_historyCreateManyRelationshipsInputObjectSchema } from './relationship_historyCreateManyRelationshipsInput.schema'

export const relationship_historyCreateManyRelationshipsInputEnvelopeObjectSchema: z.ZodType<Prisma.relationship_historyCreateManyRelationshipsInputEnvelope, Prisma.relationship_historyCreateManyRelationshipsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => relationship_historyCreateManyRelationshipsInputObjectSchema), z.lazy(() => relationship_historyCreateManyRelationshipsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const relationship_historyCreateManyRelationshipsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => relationship_historyCreateManyRelationshipsInputObjectSchema), z.lazy(() => relationship_historyCreateManyRelationshipsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
