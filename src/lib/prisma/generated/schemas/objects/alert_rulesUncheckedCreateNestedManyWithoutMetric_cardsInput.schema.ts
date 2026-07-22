// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { alert_rulesCreateWithoutMetric_cardsInputObjectSchema } from './alert_rulesCreateWithoutMetric_cardsInput.schema';
import { alert_rulesUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './alert_rulesUncheckedCreateWithoutMetric_cardsInput.schema';
import { alert_rulesCreateOrConnectWithoutMetric_cardsInputObjectSchema } from './alert_rulesCreateOrConnectWithoutMetric_cardsInput.schema';
import { alert_rulesCreateManyMetric_cardsInputEnvelopeObjectSchema } from './alert_rulesCreateManyMetric_cardsInputEnvelope.schema';
import { alert_rulesWhereUniqueInputObjectSchema } from './alert_rulesWhereUniqueInput.schema'

export const alert_rulesUncheckedCreateNestedManyWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.alert_rulesUncheckedCreateNestedManyWithoutMetric_cardsInput, Prisma.alert_rulesUncheckedCreateNestedManyWithoutMetric_cardsInput> = z.object({
  create: z.union([z.lazy(() => alert_rulesCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesCreateWithoutMetric_cardsInputObjectSchema).array(), z.lazy(() => alert_rulesUncheckedCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesUncheckedCreateWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => alert_rulesCreateOrConnectWithoutMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesCreateOrConnectWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => alert_rulesCreateManyMetric_cardsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => alert_rulesWhereUniqueInputObjectSchema), z.lazy(() => alert_rulesWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const alert_rulesUncheckedCreateNestedManyWithoutMetric_cardsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => alert_rulesCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesCreateWithoutMetric_cardsInputObjectSchema).array(), z.lazy(() => alert_rulesUncheckedCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesUncheckedCreateWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => alert_rulesCreateOrConnectWithoutMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesCreateOrConnectWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => alert_rulesCreateManyMetric_cardsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => alert_rulesWhereUniqueInputObjectSchema), z.lazy(() => alert_rulesWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
