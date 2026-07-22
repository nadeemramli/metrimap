// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateWithoutProjectsInputObjectSchema } from './metric_cardsCreateWithoutProjectsInput.schema';
import { metric_cardsUncheckedCreateWithoutProjectsInputObjectSchema } from './metric_cardsUncheckedCreateWithoutProjectsInput.schema';
import { metric_cardsCreateOrConnectWithoutProjectsInputObjectSchema } from './metric_cardsCreateOrConnectWithoutProjectsInput.schema';
import { metric_cardsCreateManyProjectsInputEnvelopeObjectSchema } from './metric_cardsCreateManyProjectsInputEnvelope.schema';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema'

export const metric_cardsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema: z.ZodType<Prisma.metric_cardsUncheckedCreateNestedManyWithoutProjectsInput, Prisma.metric_cardsUncheckedCreateNestedManyWithoutProjectsInput> = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutProjectsInputObjectSchema), z.lazy(() => metric_cardsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => metric_cardsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_cardsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => metric_cardsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_cardsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const metric_cardsUncheckedCreateNestedManyWithoutProjectsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutProjectsInputObjectSchema), z.lazy(() => metric_cardsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => metric_cardsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_cardsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => metric_cardsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_cardsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
