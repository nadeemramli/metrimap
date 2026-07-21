// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_card_tagsCreateManyTagsInputObjectSchema } from './metric_card_tagsCreateManyTagsInput.schema'

export const metric_card_tagsCreateManyTagsInputEnvelopeObjectSchema: z.ZodType<Prisma.metric_card_tagsCreateManyTagsInputEnvelope, Prisma.metric_card_tagsCreateManyTagsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => metric_card_tagsCreateManyTagsInputObjectSchema), z.lazy(() => metric_card_tagsCreateManyTagsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const metric_card_tagsCreateManyTagsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => metric_card_tagsCreateManyTagsInputObjectSchema), z.lazy(() => metric_card_tagsCreateManyTagsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
