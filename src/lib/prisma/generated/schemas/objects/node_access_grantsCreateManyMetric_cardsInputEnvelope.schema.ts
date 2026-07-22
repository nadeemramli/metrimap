// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { node_access_grantsCreateManyMetric_cardsInputObjectSchema } from './node_access_grantsCreateManyMetric_cardsInput.schema'

export const node_access_grantsCreateManyMetric_cardsInputEnvelopeObjectSchema: z.ZodType<Prisma.node_access_grantsCreateManyMetric_cardsInputEnvelope, Prisma.node_access_grantsCreateManyMetric_cardsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => node_access_grantsCreateManyMetric_cardsInputObjectSchema), z.lazy(() => node_access_grantsCreateManyMetric_cardsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const node_access_grantsCreateManyMetric_cardsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => node_access_grantsCreateManyMetric_cardsInputObjectSchema), z.lazy(() => node_access_grantsCreateManyMetric_cardsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
