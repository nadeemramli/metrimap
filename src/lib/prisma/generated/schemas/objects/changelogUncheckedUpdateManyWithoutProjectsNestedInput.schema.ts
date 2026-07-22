// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { changelogCreateWithoutProjectsInputObjectSchema } from './changelogCreateWithoutProjectsInput.schema';
import { changelogUncheckedCreateWithoutProjectsInputObjectSchema } from './changelogUncheckedCreateWithoutProjectsInput.schema';
import { changelogCreateOrConnectWithoutProjectsInputObjectSchema } from './changelogCreateOrConnectWithoutProjectsInput.schema';
import { changelogUpsertWithWhereUniqueWithoutProjectsInputObjectSchema } from './changelogUpsertWithWhereUniqueWithoutProjectsInput.schema';
import { changelogCreateManyProjectsInputEnvelopeObjectSchema } from './changelogCreateManyProjectsInputEnvelope.schema';
import { changelogWhereUniqueInputObjectSchema } from './changelogWhereUniqueInput.schema';
import { changelogUpdateWithWhereUniqueWithoutProjectsInputObjectSchema } from './changelogUpdateWithWhereUniqueWithoutProjectsInput.schema';
import { changelogUpdateManyWithWhereWithoutProjectsInputObjectSchema } from './changelogUpdateManyWithWhereWithoutProjectsInput.schema';
import { changelogScalarWhereInputObjectSchema } from './changelogScalarWhereInput.schema'

export const changelogUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema: z.ZodType<Prisma.changelogUncheckedUpdateManyWithoutProjectsNestedInput, Prisma.changelogUncheckedUpdateManyWithoutProjectsNestedInput> = z.object({
  create: z.union([z.lazy(() => changelogCreateWithoutProjectsInputObjectSchema), z.lazy(() => changelogCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => changelogUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => changelogUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => changelogCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => changelogCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => changelogUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => changelogUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => changelogCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => changelogWhereUniqueInputObjectSchema), z.lazy(() => changelogWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => changelogWhereUniqueInputObjectSchema), z.lazy(() => changelogWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => changelogWhereUniqueInputObjectSchema), z.lazy(() => changelogWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => changelogWhereUniqueInputObjectSchema), z.lazy(() => changelogWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => changelogUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => changelogUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => changelogUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => changelogUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => changelogScalarWhereInputObjectSchema), z.lazy(() => changelogScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const changelogUncheckedUpdateManyWithoutProjectsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => changelogCreateWithoutProjectsInputObjectSchema), z.lazy(() => changelogCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => changelogUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => changelogUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => changelogCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => changelogCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => changelogUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => changelogUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => changelogCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => changelogWhereUniqueInputObjectSchema), z.lazy(() => changelogWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => changelogWhereUniqueInputObjectSchema), z.lazy(() => changelogWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => changelogWhereUniqueInputObjectSchema), z.lazy(() => changelogWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => changelogWhereUniqueInputObjectSchema), z.lazy(() => changelogWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => changelogUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => changelogUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => changelogUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => changelogUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => changelogScalarWhereInputObjectSchema), z.lazy(() => changelogScalarWhereInputObjectSchema).array()]).optional()
}).strict();
