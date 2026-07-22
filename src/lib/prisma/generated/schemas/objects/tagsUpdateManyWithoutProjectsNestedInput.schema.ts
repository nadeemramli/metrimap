// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsCreateWithoutProjectsInputObjectSchema } from './tagsCreateWithoutProjectsInput.schema';
import { tagsUncheckedCreateWithoutProjectsInputObjectSchema } from './tagsUncheckedCreateWithoutProjectsInput.schema';
import { tagsCreateOrConnectWithoutProjectsInputObjectSchema } from './tagsCreateOrConnectWithoutProjectsInput.schema';
import { tagsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema } from './tagsUpsertWithWhereUniqueWithoutProjectsInput.schema';
import { tagsCreateManyProjectsInputEnvelopeObjectSchema } from './tagsCreateManyProjectsInputEnvelope.schema';
import { tagsWhereUniqueInputObjectSchema } from './tagsWhereUniqueInput.schema';
import { tagsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema } from './tagsUpdateWithWhereUniqueWithoutProjectsInput.schema';
import { tagsUpdateManyWithWhereWithoutProjectsInputObjectSchema } from './tagsUpdateManyWithWhereWithoutProjectsInput.schema';
import { tagsScalarWhereInputObjectSchema } from './tagsScalarWhereInput.schema'

export const tagsUpdateManyWithoutProjectsNestedInputObjectSchema: z.ZodType<Prisma.tagsUpdateManyWithoutProjectsNestedInput, Prisma.tagsUpdateManyWithoutProjectsNestedInput> = z.object({
  create: z.union([z.lazy(() => tagsCreateWithoutProjectsInputObjectSchema), z.lazy(() => tagsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => tagsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => tagsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => tagsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => tagsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => tagsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => tagsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => tagsWhereUniqueInputObjectSchema), z.lazy(() => tagsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => tagsWhereUniqueInputObjectSchema), z.lazy(() => tagsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => tagsWhereUniqueInputObjectSchema), z.lazy(() => tagsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => tagsWhereUniqueInputObjectSchema), z.lazy(() => tagsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => tagsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => tagsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => tagsUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => tagsUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => tagsScalarWhereInputObjectSchema), z.lazy(() => tagsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const tagsUpdateManyWithoutProjectsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => tagsCreateWithoutProjectsInputObjectSchema), z.lazy(() => tagsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => tagsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => tagsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => tagsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => tagsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => tagsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => tagsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => tagsWhereUniqueInputObjectSchema), z.lazy(() => tagsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => tagsWhereUniqueInputObjectSchema), z.lazy(() => tagsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => tagsWhereUniqueInputObjectSchema), z.lazy(() => tagsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => tagsWhereUniqueInputObjectSchema), z.lazy(() => tagsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => tagsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => tagsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => tagsUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => tagsUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => tagsScalarWhereInputObjectSchema), z.lazy(() => tagsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
