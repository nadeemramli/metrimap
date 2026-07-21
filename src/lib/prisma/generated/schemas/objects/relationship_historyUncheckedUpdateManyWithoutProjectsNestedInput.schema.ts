// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_historyCreateWithoutProjectsInputObjectSchema } from './relationship_historyCreateWithoutProjectsInput.schema';
import { relationship_historyUncheckedCreateWithoutProjectsInputObjectSchema } from './relationship_historyUncheckedCreateWithoutProjectsInput.schema';
import { relationship_historyCreateOrConnectWithoutProjectsInputObjectSchema } from './relationship_historyCreateOrConnectWithoutProjectsInput.schema';
import { relationship_historyUpsertWithWhereUniqueWithoutProjectsInputObjectSchema } from './relationship_historyUpsertWithWhereUniqueWithoutProjectsInput.schema';
import { relationship_historyCreateManyProjectsInputEnvelopeObjectSchema } from './relationship_historyCreateManyProjectsInputEnvelope.schema';
import { relationship_historyWhereUniqueInputObjectSchema } from './relationship_historyWhereUniqueInput.schema';
import { relationship_historyUpdateWithWhereUniqueWithoutProjectsInputObjectSchema } from './relationship_historyUpdateWithWhereUniqueWithoutProjectsInput.schema';
import { relationship_historyUpdateManyWithWhereWithoutProjectsInputObjectSchema } from './relationship_historyUpdateManyWithWhereWithoutProjectsInput.schema';
import { relationship_historyScalarWhereInputObjectSchema } from './relationship_historyScalarWhereInput.schema'

export const relationship_historyUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema: z.ZodType<Prisma.relationship_historyUncheckedUpdateManyWithoutProjectsNestedInput, Prisma.relationship_historyUncheckedUpdateManyWithoutProjectsNestedInput> = z.object({
  create: z.union([z.lazy(() => relationship_historyCreateWithoutProjectsInputObjectSchema), z.lazy(() => relationship_historyCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => relationship_historyUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => relationship_historyUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationship_historyCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => relationship_historyCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => relationship_historyUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => relationship_historyUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationship_historyCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => relationship_historyWhereUniqueInputObjectSchema), z.lazy(() => relationship_historyWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => relationship_historyWhereUniqueInputObjectSchema), z.lazy(() => relationship_historyWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => relationship_historyWhereUniqueInputObjectSchema), z.lazy(() => relationship_historyWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => relationship_historyWhereUniqueInputObjectSchema), z.lazy(() => relationship_historyWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => relationship_historyUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => relationship_historyUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => relationship_historyUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => relationship_historyUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => relationship_historyScalarWhereInputObjectSchema), z.lazy(() => relationship_historyScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const relationship_historyUncheckedUpdateManyWithoutProjectsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => relationship_historyCreateWithoutProjectsInputObjectSchema), z.lazy(() => relationship_historyCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => relationship_historyUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => relationship_historyUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationship_historyCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => relationship_historyCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => relationship_historyUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => relationship_historyUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationship_historyCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => relationship_historyWhereUniqueInputObjectSchema), z.lazy(() => relationship_historyWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => relationship_historyWhereUniqueInputObjectSchema), z.lazy(() => relationship_historyWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => relationship_historyWhereUniqueInputObjectSchema), z.lazy(() => relationship_historyWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => relationship_historyWhereUniqueInputObjectSchema), z.lazy(() => relationship_historyWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => relationship_historyUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => relationship_historyUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => relationship_historyUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => relationship_historyUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => relationship_historyScalarWhereInputObjectSchema), z.lazy(() => relationship_historyScalarWhereInputObjectSchema).array()]).optional()
}).strict();
