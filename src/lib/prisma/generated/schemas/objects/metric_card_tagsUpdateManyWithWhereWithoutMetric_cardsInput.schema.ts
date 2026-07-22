// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_card_tagsScalarWhereInputObjectSchema } from './metric_card_tagsScalarWhereInput.schema';
import { metric_card_tagsUpdateManyMutationInputObjectSchema } from './metric_card_tagsUpdateManyMutationInput.schema';
import { metric_card_tagsUncheckedUpdateManyWithoutMetric_cardsInputObjectSchema } from './metric_card_tagsUncheckedUpdateManyWithoutMetric_cardsInput.schema'

export const metric_card_tagsUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.metric_card_tagsUpdateManyWithWhereWithoutMetric_cardsInput, Prisma.metric_card_tagsUpdateManyWithWhereWithoutMetric_cardsInput> = z.object({
  where: z.lazy(() => metric_card_tagsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => metric_card_tagsUpdateManyMutationInputObjectSchema), z.lazy(() => metric_card_tagsUncheckedUpdateManyWithoutMetric_cardsInputObjectSchema)])
}).strict();
export const metric_card_tagsUpdateManyWithWhereWithoutMetric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_card_tagsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => metric_card_tagsUpdateManyMutationInputObjectSchema), z.lazy(() => metric_card_tagsUncheckedUpdateManyWithoutMetric_cardsInputObjectSchema)])
}).strict();
