// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { alert_rulesCreateManyMetric_cardsInputObjectSchema } from './alert_rulesCreateManyMetric_cardsInput.schema'

export const alert_rulesCreateManyMetric_cardsInputEnvelopeObjectSchema: z.ZodType<Prisma.alert_rulesCreateManyMetric_cardsInputEnvelope, Prisma.alert_rulesCreateManyMetric_cardsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => alert_rulesCreateManyMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesCreateManyMetric_cardsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const alert_rulesCreateManyMetric_cardsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => alert_rulesCreateManyMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesCreateManyMetric_cardsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
