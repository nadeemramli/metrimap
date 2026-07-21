// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { alert_rulesWhereUniqueInputObjectSchema } from './alert_rulesWhereUniqueInput.schema';
import { alert_rulesUpdateWithoutMetric_cardsInputObjectSchema } from './alert_rulesUpdateWithoutMetric_cardsInput.schema';
import { alert_rulesUncheckedUpdateWithoutMetric_cardsInputObjectSchema } from './alert_rulesUncheckedUpdateWithoutMetric_cardsInput.schema';
import { alert_rulesCreateWithoutMetric_cardsInputObjectSchema } from './alert_rulesCreateWithoutMetric_cardsInput.schema';
import { alert_rulesUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './alert_rulesUncheckedCreateWithoutMetric_cardsInput.schema'

export const alert_rulesUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.alert_rulesUpsertWithWhereUniqueWithoutMetric_cardsInput, Prisma.alert_rulesUpsertWithWhereUniqueWithoutMetric_cardsInput> = z.object({
  where: z.lazy(() => alert_rulesWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => alert_rulesUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesUncheckedUpdateWithoutMetric_cardsInputObjectSchema)]),
  create: z.union([z.lazy(() => alert_rulesCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesUncheckedCreateWithoutMetric_cardsInputObjectSchema)])
}).strict();
export const alert_rulesUpsertWithWhereUniqueWithoutMetric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => alert_rulesWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => alert_rulesUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesUncheckedUpdateWithoutMetric_cardsInputObjectSchema)]),
  create: z.union([z.lazy(() => alert_rulesCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesUncheckedCreateWithoutMetric_cardsInputObjectSchema)])
}).strict();
