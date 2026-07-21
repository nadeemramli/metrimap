// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateManyProjectsInputObjectSchema } from './metric_cardsCreateManyProjectsInput.schema'

export const metric_cardsCreateManyProjectsInputEnvelopeObjectSchema: z.ZodType<Prisma.metric_cardsCreateManyProjectsInputEnvelope, Prisma.metric_cardsCreateManyProjectsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => metric_cardsCreateManyProjectsInputObjectSchema), z.lazy(() => metric_cardsCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const metric_cardsCreateManyProjectsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => metric_cardsCreateManyProjectsInputObjectSchema), z.lazy(() => metric_cardsCreateManyProjectsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
