// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateWithoutProjectsInputObjectSchema } from './metric_cardsCreateWithoutProjectsInput.schema';
import { metric_cardsUncheckedCreateWithoutProjectsInputObjectSchema } from './metric_cardsUncheckedCreateWithoutProjectsInput.schema';
import { metric_cardsCreateOrConnectWithoutProjectsInputObjectSchema } from './metric_cardsCreateOrConnectWithoutProjectsInput.schema';
import { metric_cardsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema } from './metric_cardsUpsertWithWhereUniqueWithoutProjectsInput.schema';
import { metric_cardsCreateManyProjectsInputEnvelopeObjectSchema } from './metric_cardsCreateManyProjectsInputEnvelope.schema';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema';
import { metric_cardsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema } from './metric_cardsUpdateWithWhereUniqueWithoutProjectsInput.schema';
import { metric_cardsUpdateManyWithWhereWithoutProjectsInputObjectSchema } from './metric_cardsUpdateManyWithWhereWithoutProjectsInput.schema';
import { metric_cardsScalarWhereInputObjectSchema } from './metric_cardsScalarWhereInput.schema'

export const metric_cardsUpdateManyWithoutProjectsNestedInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdateManyWithoutProjectsNestedInput, Prisma.metric_cardsUpdateManyWithoutProjectsNestedInput> = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutProjectsInputObjectSchema), z.lazy(() => metric_cardsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => metric_cardsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_cardsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => metric_cardsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => metric_cardsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => metric_cardsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_cardsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => metric_cardsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => metric_cardsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => metric_cardsUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => metric_cardsUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => metric_cardsScalarWhereInputObjectSchema), z.lazy(() => metric_cardsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const metric_cardsUpdateManyWithoutProjectsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutProjectsInputObjectSchema), z.lazy(() => metric_cardsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => metric_cardsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_cardsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => metric_cardsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => metric_cardsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => metric_cardsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_cardsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => metric_cardsWhereUniqueInputObjectSchema), z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => metric_cardsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => metric_cardsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => metric_cardsUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => metric_cardsUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => metric_cardsScalarWhereInputObjectSchema), z.lazy(() => metric_cardsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
