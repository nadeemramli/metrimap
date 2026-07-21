// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateManyUsers_metric_cards_created_byTousersInputObjectSchema } from './metric_cardsCreateManyUsers_metric_cards_created_byTousersInput.schema'

export const metric_cardsCreateManyUsers_metric_cards_created_byTousersInputEnvelopeObjectSchema: z.ZodType<Prisma.metric_cardsCreateManyUsers_metric_cards_created_byTousersInputEnvelope, Prisma.metric_cardsCreateManyUsers_metric_cards_created_byTousersInputEnvelope> = z.object({
  data: z.union([z.lazy(() => metric_cardsCreateManyUsers_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => metric_cardsCreateManyUsers_metric_cards_created_byTousersInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const metric_cardsCreateManyUsers_metric_cards_created_byTousersInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => metric_cardsCreateManyUsers_metric_cards_created_byTousersInputObjectSchema), z.lazy(() => metric_cardsCreateManyUsers_metric_cards_created_byTousersInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
