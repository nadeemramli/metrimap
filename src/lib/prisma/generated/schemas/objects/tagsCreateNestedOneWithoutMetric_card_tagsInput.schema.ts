// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsCreateWithoutMetric_card_tagsInputObjectSchema } from './tagsCreateWithoutMetric_card_tagsInput.schema';
import { tagsUncheckedCreateWithoutMetric_card_tagsInputObjectSchema } from './tagsUncheckedCreateWithoutMetric_card_tagsInput.schema';
import { tagsCreateOrConnectWithoutMetric_card_tagsInputObjectSchema } from './tagsCreateOrConnectWithoutMetric_card_tagsInput.schema';
import { tagsWhereUniqueInputObjectSchema } from './tagsWhereUniqueInput.schema'

export const tagsCreateNestedOneWithoutMetric_card_tagsInputObjectSchema: z.ZodType<Prisma.tagsCreateNestedOneWithoutMetric_card_tagsInput, Prisma.tagsCreateNestedOneWithoutMetric_card_tagsInput> = z.object({
  create: z.union([z.lazy(() => tagsCreateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutMetric_card_tagsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tagsCreateOrConnectWithoutMetric_card_tagsInputObjectSchema).optional(),
  connect: z.lazy(() => tagsWhereUniqueInputObjectSchema).optional()
}).strict();
export const tagsCreateNestedOneWithoutMetric_card_tagsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => tagsCreateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutMetric_card_tagsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tagsCreateOrConnectWithoutMetric_card_tagsInputObjectSchema).optional(),
  connect: z.lazy(() => tagsWhereUniqueInputObjectSchema).optional()
}).strict();
