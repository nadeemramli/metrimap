// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_metric_linksCreateWithoutMetric_cardsInputObjectSchema } from './strategy_metric_linksCreateWithoutMetric_cardsInput.schema';
import { strategy_metric_linksUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './strategy_metric_linksUncheckedCreateWithoutMetric_cardsInput.schema';
import { strategy_metric_linksCreateOrConnectWithoutMetric_cardsInputObjectSchema } from './strategy_metric_linksCreateOrConnectWithoutMetric_cardsInput.schema';
import { strategy_metric_linksCreateManyMetric_cardsInputEnvelopeObjectSchema } from './strategy_metric_linksCreateManyMetric_cardsInputEnvelope.schema';
import { strategy_metric_linksWhereUniqueInputObjectSchema } from './strategy_metric_linksWhereUniqueInput.schema'

export const strategy_metric_linksCreateNestedManyWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksCreateNestedManyWithoutMetric_cardsInput, Prisma.strategy_metric_linksCreateNestedManyWithoutMetric_cardsInput> = z.object({
  create: z.union([z.lazy(() => strategy_metric_linksCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateWithoutMetric_cardsInputObjectSchema).array(), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => strategy_metric_linksCreateOrConnectWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateOrConnectWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => strategy_metric_linksCreateManyMetric_cardsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const strategy_metric_linksCreateNestedManyWithoutMetric_cardsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => strategy_metric_linksCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateWithoutMetric_cardsInputObjectSchema).array(), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => strategy_metric_linksCreateOrConnectWithoutMetric_cardsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateOrConnectWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => strategy_metric_linksCreateManyMetric_cardsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema), z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
