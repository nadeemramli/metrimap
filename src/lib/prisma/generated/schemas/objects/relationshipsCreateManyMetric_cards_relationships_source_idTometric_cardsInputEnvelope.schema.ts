// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsCreateManyMetric_cards_relationships_source_idTometric_cardsInputObjectSchema } from './relationshipsCreateManyMetric_cards_relationships_source_idTometric_cardsInput.schema'

export const relationshipsCreateManyMetric_cards_relationships_source_idTometric_cardsInputEnvelopeObjectSchema: z.ZodType<Prisma.relationshipsCreateManyMetric_cards_relationships_source_idTometric_cardsInputEnvelope, Prisma.relationshipsCreateManyMetric_cards_relationships_source_idTometric_cardsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => relationshipsCreateManyMetric_cards_relationships_source_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsCreateManyMetric_cards_relationships_source_idTometric_cardsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const relationshipsCreateManyMetric_cards_relationships_source_idTometric_cardsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => relationshipsCreateManyMetric_cards_relationships_source_idTometric_cardsInputObjectSchema), z.lazy(() => relationshipsCreateManyMetric_cards_relationships_source_idTometric_cardsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
