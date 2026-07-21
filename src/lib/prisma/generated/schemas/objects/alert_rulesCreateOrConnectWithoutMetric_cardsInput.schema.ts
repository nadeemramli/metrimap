// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { alert_rulesWhereUniqueInputObjectSchema } from './alert_rulesWhereUniqueInput.schema';
import { alert_rulesCreateWithoutMetric_cardsInputObjectSchema } from './alert_rulesCreateWithoutMetric_cardsInput.schema';
import { alert_rulesUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './alert_rulesUncheckedCreateWithoutMetric_cardsInput.schema'

export const alert_rulesCreateOrConnectWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.alert_rulesCreateOrConnectWithoutMetric_cardsInput, Prisma.alert_rulesCreateOrConnectWithoutMetric_cardsInput> = z.object({
  where: z.lazy(() => alert_rulesWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => alert_rulesCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesUncheckedCreateWithoutMetric_cardsInputObjectSchema)])
}).strict();
export const alert_rulesCreateOrConnectWithoutMetric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => alert_rulesWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => alert_rulesCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesUncheckedCreateWithoutMetric_cardsInputObjectSchema)])
}).strict();
