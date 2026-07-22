// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsWhereUniqueInputObjectSchema } from './tagsWhereUniqueInput.schema';
import { tagsCreateWithoutMetric_card_tagsInputObjectSchema } from './tagsCreateWithoutMetric_card_tagsInput.schema';
import { tagsUncheckedCreateWithoutMetric_card_tagsInputObjectSchema } from './tagsUncheckedCreateWithoutMetric_card_tagsInput.schema'

export const tagsCreateOrConnectWithoutMetric_card_tagsInputObjectSchema: z.ZodType<Prisma.tagsCreateOrConnectWithoutMetric_card_tagsInput, Prisma.tagsCreateOrConnectWithoutMetric_card_tagsInput> = z.object({
  where: z.lazy(() => tagsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => tagsCreateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutMetric_card_tagsInputObjectSchema)])
}).strict();
export const tagsCreateOrConnectWithoutMetric_card_tagsInputObjectZodSchema = z.object({
  where: z.lazy(() => tagsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => tagsCreateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutMetric_card_tagsInputObjectSchema)])
}).strict();
