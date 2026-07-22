// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsCreateManyRelationshipsInputObjectSchema } from './evidence_itemsCreateManyRelationshipsInput.schema'

export const evidence_itemsCreateManyRelationshipsInputEnvelopeObjectSchema: z.ZodType<Prisma.evidence_itemsCreateManyRelationshipsInputEnvelope, Prisma.evidence_itemsCreateManyRelationshipsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => evidence_itemsCreateManyRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsCreateManyRelationshipsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const evidence_itemsCreateManyRelationshipsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => evidence_itemsCreateManyRelationshipsInputObjectSchema), z.lazy(() => evidence_itemsCreateManyRelationshipsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
