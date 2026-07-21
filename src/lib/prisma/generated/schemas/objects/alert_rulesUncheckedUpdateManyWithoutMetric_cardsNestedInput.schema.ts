// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { alert_rulesCreateWithoutMetric_cardsInputObjectSchema } from './alert_rulesCreateWithoutMetric_cardsInput.schema';
import { alert_rulesUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './alert_rulesUncheckedCreateWithoutMetric_cardsInput.schema';
import { alert_rulesCreateOrConnectWithoutMetric_cardsInputObjectSchema } from './alert_rulesCreateOrConnectWithoutMetric_cardsInput.schema';
import { alert_rulesUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema } from './alert_rulesUpsertWithWhereUniqueWithoutMetric_cardsInput.schema';
import { alert_rulesCreateManyMetric_cardsInputEnvelopeObjectSchema } from './alert_rulesCreateManyMetric_cardsInputEnvelope.schema';
import { alert_rulesWhereUniqueInputObjectSchema } from './alert_rulesWhereUniqueInput.schema';
import { alert_rulesUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema } from './alert_rulesUpdateWithWhereUniqueWithoutMetric_cardsInput.schema';
import { alert_rulesUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema } from './alert_rulesUpdateManyWithWhereWithoutMetric_cardsInput.schema';
import { alert_rulesScalarWhereInputObjectSchema } from './alert_rulesScalarWhereInput.schema'

export const alert_rulesUncheckedUpdateManyWithoutMetric_cardsNestedInputObjectSchema: z.ZodType<Prisma.alert_rulesUncheckedUpdateManyWithoutMetric_cardsNestedInput, Prisma.alert_rulesUncheckedUpdateManyWithoutMetric_cardsNestedInput> = z.object({
  create: z.union([z.lazy(() => alert_rulesCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesCreateWithoutMetric_cardsInputObjectSchema).array(), z.lazy(() => alert_rulesUncheckedCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesUncheckedCreateWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => alert_rulesCreateOrConnectWithoutMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesCreateOrConnectWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => alert_rulesUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => alert_rulesCreateManyMetric_cardsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => alert_rulesWhereUniqueInputObjectSchema), z.lazy(() => alert_rulesWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => alert_rulesWhereUniqueInputObjectSchema), z.lazy(() => alert_rulesWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => alert_rulesWhereUniqueInputObjectSchema), z.lazy(() => alert_rulesWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => alert_rulesWhereUniqueInputObjectSchema), z.lazy(() => alert_rulesWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => alert_rulesUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => alert_rulesUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => alert_rulesScalarWhereInputObjectSchema), z.lazy(() => alert_rulesScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const alert_rulesUncheckedUpdateManyWithoutMetric_cardsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => alert_rulesCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesCreateWithoutMetric_cardsInputObjectSchema).array(), z.lazy(() => alert_rulesUncheckedCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesUncheckedCreateWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => alert_rulesCreateOrConnectWithoutMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesCreateOrConnectWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => alert_rulesUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => alert_rulesCreateManyMetric_cardsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => alert_rulesWhereUniqueInputObjectSchema), z.lazy(() => alert_rulesWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => alert_rulesWhereUniqueInputObjectSchema), z.lazy(() => alert_rulesWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => alert_rulesWhereUniqueInputObjectSchema), z.lazy(() => alert_rulesWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => alert_rulesWhereUniqueInputObjectSchema), z.lazy(() => alert_rulesWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => alert_rulesUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => alert_rulesUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema), z.lazy(() => alert_rulesUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => alert_rulesScalarWhereInputObjectSchema), z.lazy(() => alert_rulesScalarWhereInputObjectSchema).array()]).optional()
}).strict();
