// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateManyUsers_metric_cards_owner_idTousersInputObjectSchema } from './metric_cardsCreateManyUsers_metric_cards_owner_idTousersInput.schema'

export const metric_cardsCreateManyUsers_metric_cards_owner_idTousersInputEnvelopeObjectSchema: z.ZodType<Prisma.metric_cardsCreateManyUsers_metric_cards_owner_idTousersInputEnvelope, Prisma.metric_cardsCreateManyUsers_metric_cards_owner_idTousersInputEnvelope> = z.object({
  data: z.union([z.lazy(() => metric_cardsCreateManyUsers_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => metric_cardsCreateManyUsers_metric_cards_owner_idTousersInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const metric_cardsCreateManyUsers_metric_cards_owner_idTousersInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => metric_cardsCreateManyUsers_metric_cards_owner_idTousersInputObjectSchema), z.lazy(() => metric_cardsCreateManyUsers_metric_cards_owner_idTousersInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
