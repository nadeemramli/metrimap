// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { alert_rulesWhereUniqueInputObjectSchema } from './alert_rulesWhereUniqueInput.schema';
import { alert_rulesUpdateWithoutMetric_cardsInputObjectSchema } from './alert_rulesUpdateWithoutMetric_cardsInput.schema';
import { alert_rulesUncheckedUpdateWithoutMetric_cardsInputObjectSchema } from './alert_rulesUncheckedUpdateWithoutMetric_cardsInput.schema'

export const alert_rulesUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.alert_rulesUpdateWithWhereUniqueWithoutMetric_cardsInput, Prisma.alert_rulesUpdateWithWhereUniqueWithoutMetric_cardsInput> = z.object({
  where: z.lazy(() => alert_rulesWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => alert_rulesUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesUncheckedUpdateWithoutMetric_cardsInputObjectSchema)])
}).strict();
export const alert_rulesUpdateWithWhereUniqueWithoutMetric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => alert_rulesWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => alert_rulesUpdateWithoutMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesUncheckedUpdateWithoutMetric_cardsInputObjectSchema)])
}).strict();
