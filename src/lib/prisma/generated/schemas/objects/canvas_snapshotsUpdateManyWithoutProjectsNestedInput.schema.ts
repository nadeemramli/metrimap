// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { canvas_snapshotsCreateWithoutProjectsInputObjectSchema } from './canvas_snapshotsCreateWithoutProjectsInput.schema';
import { canvas_snapshotsUncheckedCreateWithoutProjectsInputObjectSchema } from './canvas_snapshotsUncheckedCreateWithoutProjectsInput.schema';
import { canvas_snapshotsCreateOrConnectWithoutProjectsInputObjectSchema } from './canvas_snapshotsCreateOrConnectWithoutProjectsInput.schema';
import { canvas_snapshotsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema } from './canvas_snapshotsUpsertWithWhereUniqueWithoutProjectsInput.schema';
import { canvas_snapshotsCreateManyProjectsInputEnvelopeObjectSchema } from './canvas_snapshotsCreateManyProjectsInputEnvelope.schema';
import { canvas_snapshotsWhereUniqueInputObjectSchema } from './canvas_snapshotsWhereUniqueInput.schema';
import { canvas_snapshotsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema } from './canvas_snapshotsUpdateWithWhereUniqueWithoutProjectsInput.schema';
import { canvas_snapshotsUpdateManyWithWhereWithoutProjectsInputObjectSchema } from './canvas_snapshotsUpdateManyWithWhereWithoutProjectsInput.schema';
import { canvas_snapshotsScalarWhereInputObjectSchema } from './canvas_snapshotsScalarWhereInput.schema'

export const canvas_snapshotsUpdateManyWithoutProjectsNestedInputObjectSchema: z.ZodType<Prisma.canvas_snapshotsUpdateManyWithoutProjectsNestedInput, Prisma.canvas_snapshotsUpdateManyWithoutProjectsNestedInput> = z.object({
  create: z.union([z.lazy(() => canvas_snapshotsCreateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => canvas_snapshotsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => canvas_snapshotsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => canvas_snapshotsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => canvas_snapshotsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => canvas_snapshotsWhereUniqueInputObjectSchema), z.lazy(() => canvas_snapshotsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => canvas_snapshotsWhereUniqueInputObjectSchema), z.lazy(() => canvas_snapshotsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => canvas_snapshotsWhereUniqueInputObjectSchema), z.lazy(() => canvas_snapshotsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => canvas_snapshotsWhereUniqueInputObjectSchema), z.lazy(() => canvas_snapshotsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => canvas_snapshotsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => canvas_snapshotsUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => canvas_snapshotsScalarWhereInputObjectSchema), z.lazy(() => canvas_snapshotsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const canvas_snapshotsUpdateManyWithoutProjectsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => canvas_snapshotsCreateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => canvas_snapshotsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => canvas_snapshotsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => canvas_snapshotsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => canvas_snapshotsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => canvas_snapshotsWhereUniqueInputObjectSchema), z.lazy(() => canvas_snapshotsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => canvas_snapshotsWhereUniqueInputObjectSchema), z.lazy(() => canvas_snapshotsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => canvas_snapshotsWhereUniqueInputObjectSchema), z.lazy(() => canvas_snapshotsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => canvas_snapshotsWhereUniqueInputObjectSchema), z.lazy(() => canvas_snapshotsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => canvas_snapshotsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => canvas_snapshotsUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => canvas_snapshotsUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => canvas_snapshotsScalarWhereInputObjectSchema), z.lazy(() => canvas_snapshotsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
