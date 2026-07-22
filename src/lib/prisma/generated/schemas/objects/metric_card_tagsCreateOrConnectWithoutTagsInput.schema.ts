// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_card_tagsWhereUniqueInputObjectSchema } from './metric_card_tagsWhereUniqueInput.schema';
import { metric_card_tagsCreateWithoutTagsInputObjectSchema } from './metric_card_tagsCreateWithoutTagsInput.schema';
import { metric_card_tagsUncheckedCreateWithoutTagsInputObjectSchema } from './metric_card_tagsUncheckedCreateWithoutTagsInput.schema'

export const metric_card_tagsCreateOrConnectWithoutTagsInputObjectSchema: z.ZodType<Prisma.metric_card_tagsCreateOrConnectWithoutTagsInput, Prisma.metric_card_tagsCreateOrConnectWithoutTagsInput> = z.object({
  where: z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_card_tagsCreateWithoutTagsInputObjectSchema), z.lazy(() => metric_card_tagsUncheckedCreateWithoutTagsInputObjectSchema)])
}).strict();
export const metric_card_tagsCreateOrConnectWithoutTagsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_card_tagsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_card_tagsCreateWithoutTagsInputObjectSchema), z.lazy(() => metric_card_tagsUncheckedCreateWithoutTagsInputObjectSchema)])
}).strict();
