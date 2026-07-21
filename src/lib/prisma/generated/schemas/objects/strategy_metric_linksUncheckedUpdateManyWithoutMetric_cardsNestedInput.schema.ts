// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_metric_linksCreateWithoutMetric_cardsInputObjectSchema } from './strategy_metric_linksCreateWithoutMetric_cardsInput.schema';
import { strategy_metric_linksUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './strategy_metric_linksUncheckedCreateWithoutMetric_cardsInput.schema';
import { strategy_metric_linksCreateOrConnectWithoutMetric_cardsInputObjectSchema } from './strategy_metric_linksCreateOrConnectWithoutMetric_cardsInput.schema';
import { strategy_metric_linksUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema } from './strategy_metric_linksUpsertWithWhereUniqueWithoutMetric_cardsInput.schema';
import { strategy_metric_linksCreateManyMetric_cardsInputEnvelopeObjectSchema } from './strategy_metric_linksCreateManyMetric_cardsInputEnvelope.schema';
import { strategy_metric_linksWhereUniqueInputObjectSchema } from './strategy_metric_linksWhereUniqueInput.schema';
import { strategy_metric_linksUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema } from './strategy_metric_linksUpdateWithWhereUniqueWithoutMetric_cardsInput.schema';
import { strategy_metric_linksUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema } from './strategy_metric_linksUpdateManyWithWhereWithoutMetric_cardsInput.schema';
import { strategy_metric_linksScalarWhereInputObjectSchema } from './strategy_metric_linksScalarWhereInput.schema'

export const strategy_metric_linksUncheckedUpdateManyWithoutMetric_cardsNestedInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksUncheckedUpdateManyWithoutMetric_cardsNestedInput, Prisma.strategy_metric_linksUncheckedUpdateManyWithoutMetric_cardsNestedInput> = z.object({
  create: z.union([z.lazy(() => strategy_metric_linksCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateWithoutMetric_cardsInputObjectSchema).array(), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => strategy_metric_linksCreateOrConnectWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateOrConnectWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => strategy_metric_linksUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => strategy_metric_linksCreateManyMetric_cardsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => strategy_metric_linksUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => strategy_metric_linksUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema), z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const strategy_metric_linksUncheckedUpdateManyWithoutMetric_cardsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => strategy_metric_linksCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateWithoutMetric_cardsInputObjectSchema).array(), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => strategy_metric_linksCreateOrConnectWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateOrConnectWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => strategy_metric_linksUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksUpsertWithWhereUniqueWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => strategy_metric_linksCreateManyMetric_cardsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => strategy_metric_linksUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksUpdateWithWhereUniqueWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => strategy_metric_linksUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema), z.lazy(() => strategy_metric_linksScalarWhereInputObjectSchema).array()]).optional()
}).strict();
