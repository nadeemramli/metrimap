// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsCreateWithoutMetric_card_tagsInputObjectSchema } from './tagsCreateWithoutMetric_card_tagsInput.schema';
import { tagsUncheckedCreateWithoutMetric_card_tagsInputObjectSchema } from './tagsUncheckedCreateWithoutMetric_card_tagsInput.schema';
import { tagsCreateOrConnectWithoutMetric_card_tagsInputObjectSchema } from './tagsCreateOrConnectWithoutMetric_card_tagsInput.schema';
import { tagsUpsertWithoutMetric_card_tagsInputObjectSchema } from './tagsUpsertWithoutMetric_card_tagsInput.schema';
import { tagsWhereInputObjectSchema } from './tagsWhereInput.schema';
import { tagsWhereUniqueInputObjectSchema } from './tagsWhereUniqueInput.schema';
import { tagsUpdateToOneWithWhereWithoutMetric_card_tagsInputObjectSchema } from './tagsUpdateToOneWithWhereWithoutMetric_card_tagsInput.schema';
import { tagsUpdateWithoutMetric_card_tagsInputObjectSchema } from './tagsUpdateWithoutMetric_card_tagsInput.schema';
import { tagsUncheckedUpdateWithoutMetric_card_tagsInputObjectSchema } from './tagsUncheckedUpdateWithoutMetric_card_tagsInput.schema'

export const tagsUpdateOneWithoutMetric_card_tagsNestedInputObjectSchema: z.ZodType<Prisma.tagsUpdateOneWithoutMetric_card_tagsNestedInput, Prisma.tagsUpdateOneWithoutMetric_card_tagsNestedInput> = z.object({
  create: z.union([z.lazy(() => tagsCreateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutMetric_card_tagsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tagsCreateOrConnectWithoutMetric_card_tagsInputObjectSchema).optional(),
  upsert: z.lazy(() => tagsUpsertWithoutMetric_card_tagsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => tagsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => tagsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => tagsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => tagsUpdateToOneWithWhereWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => tagsUpdateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => tagsUncheckedUpdateWithoutMetric_card_tagsInputObjectSchema)]).optional()
}).strict();
export const tagsUpdateOneWithoutMetric_card_tagsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => tagsCreateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutMetric_card_tagsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => tagsCreateOrConnectWithoutMetric_card_tagsInputObjectSchema).optional(),
  upsert: z.lazy(() => tagsUpsertWithoutMetric_card_tagsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => tagsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => tagsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => tagsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => tagsUpdateToOneWithWhereWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => tagsUpdateWithoutMetric_card_tagsInputObjectSchema), z.lazy(() => tagsUncheckedUpdateWithoutMetric_card_tagsInputObjectSchema)]).optional()
}).strict();
