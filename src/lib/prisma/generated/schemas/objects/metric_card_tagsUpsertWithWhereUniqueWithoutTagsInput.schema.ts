// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_card_tagsWhereUniqueInputObjectSchema } from './metric_card_tagsWhereUniqueInput.schema';
import { metric_card_tagsUpdateWithoutTagsInputObjectSchema } from './metric_card_tagsUpdateWithoutTagsInput.schema';
import { metric_card_tagsUncheckedUpdateWithoutTagsInputObjectSchema } from './metric_card_tagsUncheckedUpdateWithoutTagsInput.schema';
import { metric_card_tagsCreateWithoutTagsInputObjectSchema } from './metric_card_tagsCreateWithoutTagsInput.schema';
import { metric_card_tagsUncheckedCreateWithoutTagsInputObjectSchema } from './metric_card_tagsUncheckedCreateWithoutTagsInput.schema'

export const metric_card_tagsUpsertWithWhereUniqueWithoutTagsInputObjectSchema: z.ZodType<Prisma.metric_card_tagsUpsertWithWhereUniqueWithoutTagsInput, Prisma.metric_card_tagsUpsertWithWhereUniqueWithoutTagsInput> = z.object({
  where: z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => metric_card_tagsUpdateWithoutTagsInputObjectSchema), z.lazy(() => metric_card_tagsUncheckedUpdateWithoutTagsInputObjectSchema)]),
  create: z.union([z.lazy(() => metric_card_tagsCreateWithoutTagsInputObjectSchema), z.lazy(() => metric_card_tagsUncheckedCreateWithoutTagsInputObjectSchema)])
}).strict();
export const metric_card_tagsUpsertWithWhereUniqueWithoutTagsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => metric_card_tagsUpdateWithoutTagsInputObjectSchema), z.lazy(() => metric_card_tagsUncheckedUpdateWithoutTagsInputObjectSchema)]),
  create: z.union([z.lazy(() => metric_card_tagsCreateWithoutTagsInputObjectSchema), z.lazy(() => metric_card_tagsUncheckedCreateWithoutTagsInputObjectSchema)])
}).strict();
