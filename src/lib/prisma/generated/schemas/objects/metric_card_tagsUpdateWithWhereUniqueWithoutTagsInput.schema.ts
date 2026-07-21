// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_card_tagsWhereUniqueInputObjectSchema } from './metric_card_tagsWhereUniqueInput.schema';
import { metric_card_tagsUpdateWithoutTagsInputObjectSchema } from './metric_card_tagsUpdateWithoutTagsInput.schema';
import { metric_card_tagsUncheckedUpdateWithoutTagsInputObjectSchema } from './metric_card_tagsUncheckedUpdateWithoutTagsInput.schema'

export const metric_card_tagsUpdateWithWhereUniqueWithoutTagsInputObjectSchema: z.ZodType<Prisma.metric_card_tagsUpdateWithWhereUniqueWithoutTagsInput, Prisma.metric_card_tagsUpdateWithWhereUniqueWithoutTagsInput> = z.object({
  where: z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => metric_card_tagsUpdateWithoutTagsInputObjectSchema), z.lazy(() => metric_card_tagsUncheckedUpdateWithoutTagsInputObjectSchema)])
}).strict();
export const metric_card_tagsUpdateWithWhereUniqueWithoutTagsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => metric_card_tagsUpdateWithoutTagsInputObjectSchema), z.lazy(() => metric_card_tagsUncheckedUpdateWithoutTagsInputObjectSchema)])
}).strict();
