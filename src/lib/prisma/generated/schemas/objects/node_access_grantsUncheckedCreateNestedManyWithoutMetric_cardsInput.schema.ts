// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { node_access_grantsCreateWithoutMetric_cardsInputObjectSchema } from './node_access_grantsCreateWithoutMetric_cardsInput.schema';
import { node_access_grantsUncheckedCreateWithoutMetric_cardsInputObjectSchema } from './node_access_grantsUncheckedCreateWithoutMetric_cardsInput.schema';
import { node_access_grantsCreateOrConnectWithoutMetric_cardsInputObjectSchema } from './node_access_grantsCreateOrConnectWithoutMetric_cardsInput.schema';
import { node_access_grantsCreateManyMetric_cardsInputEnvelopeObjectSchema } from './node_access_grantsCreateManyMetric_cardsInputEnvelope.schema';
import { node_access_grantsWhereUniqueInputObjectSchema } from './node_access_grantsWhereUniqueInput.schema'

export const node_access_grantsUncheckedCreateNestedManyWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.node_access_grantsUncheckedCreateNestedManyWithoutMetric_cardsInput, Prisma.node_access_grantsUncheckedCreateNestedManyWithoutMetric_cardsInput> = z.object({
  create: z.union([z.lazy(() => node_access_grantsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => node_access_grantsCreateWithoutMetric_cardsInputObjectSchema).array(), z.lazy(() => node_access_grantsUncheckedCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => node_access_grantsUncheckedCreateWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => node_access_grantsCreateOrConnectWithoutMetric_cardsInputObjectSchema), z.lazy(() => node_access_grantsCreateOrConnectWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => node_access_grantsCreateManyMetric_cardsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema), z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const node_access_grantsUncheckedCreateNestedManyWithoutMetric_cardsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => node_access_grantsCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => node_access_grantsCreateWithoutMetric_cardsInputObjectSchema).array(), z.lazy(() => node_access_grantsUncheckedCreateWithoutMetric_cardsInputObjectSchema), z.lazy(() => node_access_grantsUncheckedCreateWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => node_access_grantsCreateOrConnectWithoutMetric_cardsInputObjectSchema), z.lazy(() => node_access_grantsCreateOrConnectWithoutMetric_cardsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => node_access_grantsCreateManyMetric_cardsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema), z.lazy(() => node_access_grantsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
