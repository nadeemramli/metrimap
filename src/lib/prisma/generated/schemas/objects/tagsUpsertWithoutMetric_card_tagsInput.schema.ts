// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsUpdateWithoutMetric_card_tagsInputObjectSchema } from './tagsUpdateWithoutMetric_card_tagsInput.schema';
import { tagsUncheckedUpdateWithoutMetric_card_tagsInputObjectSchema } from './tagsUncheckedUpdateWithoutMetric_card_tagsInput.schema';
import { tagsCreateWithoutMetric_card_tagsInputObjectSchema } from './tagsCreateWithoutMetric_card_tagsInput.schema';
import { tagsUncheckedCreateWithoutMetric_card_tagsInputObjectSchema } from './tagsUncheckedCreateWithoutMetric_card_tagsInput.schema';
import { tagsWhereInputObjectSchema } from './tagsWhereInput.schema'

export const tagsUpsertWithoutMetric_card_tagsInputObjectSchema: z.ZodType<Prisma.tagsUpsertWithoutMetric_card_tagsInput, Prisma.tagsUpsertWithoutMetric_card_tagsInput> = z.object({
  update: z.union([z.lazy(() => tagsUpdateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => tagsUncheckedUpdateWithoutMetric_card_tagsInputObjectSchema)]),
  create: z.union([z.lazy(() => tagsCreateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutMetric_card_tagsInputObjectSchema)]),
  where: z.lazy(() => tagsWhereInputObjectSchema).optional()
}).strict();
export const tagsUpsertWithoutMetric_card_tagsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => tagsUpdateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => tagsUncheckedUpdateWithoutMetric_card_tagsInputObjectSchema)]),
  create: z.union([z.lazy(() => tagsCreateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutMetric_card_tagsInputObjectSchema)]),
  where: z.lazy(() => tagsWhereInputObjectSchema).optional()
}).strict();
