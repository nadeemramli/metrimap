// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { canvas_nodesCreateWithoutProjectsInputObjectSchema } from './canvas_nodesCreateWithoutProjectsInput.schema';
import { canvas_nodesUncheckedCreateWithoutProjectsInputObjectSchema } from './canvas_nodesUncheckedCreateWithoutProjectsInput.schema';
import { canvas_nodesCreateOrConnectWithoutProjectsInputObjectSchema } from './canvas_nodesCreateOrConnectWithoutProjectsInput.schema';
import { canvas_nodesUpsertWithWhereUniqueWithoutProjectsInputObjectSchema } from './canvas_nodesUpsertWithWhereUniqueWithoutProjectsInput.schema';
import { canvas_nodesCreateManyProjectsInputEnvelopeObjectSchema } from './canvas_nodesCreateManyProjectsInputEnvelope.schema';
import { canvas_nodesWhereUniqueInputObjectSchema } from './canvas_nodesWhereUniqueInput.schema';
import { canvas_nodesUpdateWithWhereUniqueWithoutProjectsInputObjectSchema } from './canvas_nodesUpdateWithWhereUniqueWithoutProjectsInput.schema';
import { canvas_nodesUpdateManyWithWhereWithoutProjectsInputObjectSchema } from './canvas_nodesUpdateManyWithWhereWithoutProjectsInput.schema';
import { canvas_nodesScalarWhereInputObjectSchema } from './canvas_nodesScalarWhereInput.schema'

export const canvas_nodesUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema: z.ZodType<Prisma.canvas_nodesUncheckedUpdateManyWithoutProjectsNestedInput, Prisma.canvas_nodesUncheckedUpdateManyWithoutProjectsNestedInput> = z.object({
  create: z.union([z.lazy(() => canvas_nodesCreateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_nodesCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => canvas_nodesUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_nodesUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => canvas_nodesCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => canvas_nodesCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => canvas_nodesUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => canvas_nodesUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => canvas_nodesCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => canvas_nodesWhereUniqueInputObjectSchema), z.lazy(() => canvas_nodesWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => canvas_nodesWhereUniqueInputObjectSchema), z.lazy(() => canvas_nodesWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => canvas_nodesWhereUniqueInputObjectSchema), z.lazy(() => canvas_nodesWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => canvas_nodesWhereUniqueInputObjectSchema), z.lazy(() => canvas_nodesWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => canvas_nodesUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => canvas_nodesUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => canvas_nodesUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => canvas_nodesUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => canvas_nodesScalarWhereInputObjectSchema), z.lazy(() => canvas_nodesScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const canvas_nodesUncheckedUpdateManyWithoutProjectsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => canvas_nodesCreateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_nodesCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => canvas_nodesUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_nodesUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => canvas_nodesCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => canvas_nodesCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => canvas_nodesUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => canvas_nodesUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => canvas_nodesCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => canvas_nodesWhereUniqueInputObjectSchema), z.lazy(() => canvas_nodesWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => canvas_nodesWhereUniqueInputObjectSchema), z.lazy(() => canvas_nodesWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => canvas_nodesWhereUniqueInputObjectSchema), z.lazy(() => canvas_nodesWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => canvas_nodesWhereUniqueInputObjectSchema), z.lazy(() => canvas_nodesWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => canvas_nodesUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => canvas_nodesUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => canvas_nodesUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => canvas_nodesUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => canvas_nodesScalarWhereInputObjectSchema), z.lazy(() => canvas_nodesScalarWhereInputObjectSchema).array()]).optional()
}).strict();
