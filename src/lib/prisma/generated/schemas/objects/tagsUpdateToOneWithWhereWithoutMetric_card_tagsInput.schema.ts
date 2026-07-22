// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsWhereInputObjectSchema } from './tagsWhereInput.schema';
import { tagsUpdateWithoutMetric_card_tagsInputObjectSchema } from './tagsUpdateWithoutMetric_card_tagsInput.schema';
import { tagsUncheckedUpdateWithoutMetric_card_tagsInputObjectSchema } from './tagsUncheckedUpdateWithoutMetric_card_tagsInput.schema'

export const tagsUpdateToOneWithWhereWithoutMetric_card_tagsInputObjectSchema: z.ZodType<Prisma.tagsUpdateToOneWithWhereWithoutMetric_card_tagsInput, Prisma.tagsUpdateToOneWithWhereWithoutMetric_card_tagsInput> = z.object({
  where: z.lazy(() => tagsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => tagsUpdateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => tagsUncheckedUpdateWithoutMetric_card_tagsInputObjectSchema)])
}).strict();
export const tagsUpdateToOneWithWhereWithoutMetric_card_tagsInputObjectZodSchema = z.object({
  where: z.lazy(() => tagsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => tagsUpdateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => tagsUncheckedUpdateWithoutMetric_card_tagsInputObjectSchema)])
}).strict();
