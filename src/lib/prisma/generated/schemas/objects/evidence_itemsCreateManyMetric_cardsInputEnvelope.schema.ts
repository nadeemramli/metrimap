// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { evidence_itemsCreateManyMetric_cardsInputObjectSchema } from './evidence_itemsCreateManyMetric_cardsInput.schema'

export const evidence_itemsCreateManyMetric_cardsInputEnvelopeObjectSchema: z.ZodType<Prisma.evidence_itemsCreateManyMetric_cardsInputEnvelope, Prisma.evidence_itemsCreateManyMetric_cardsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => evidence_itemsCreateManyMetric_cardsInputObjectSchema), z.lazy(() => evidence_itemsCreateManyMetric_cardsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const evidence_itemsCreateManyMetric_cardsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => evidence_itemsCreateManyMetric_cardsInputObjectSchema), z.lazy(() => evidence_itemsCreateManyMetric_cardsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
