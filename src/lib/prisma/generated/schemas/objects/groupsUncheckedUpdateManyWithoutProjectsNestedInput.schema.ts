// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { groupsCreateWithoutProjectsInputObjectSchema } from './groupsCreateWithoutProjectsInput.schema';
import { groupsUncheckedCreateWithoutProjectsInputObjectSchema } from './groupsUncheckedCreateWithoutProjectsInput.schema';
import { groupsCreateOrConnectWithoutProjectsInputObjectSchema } from './groupsCreateOrConnectWithoutProjectsInput.schema';
import { groupsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema } from './groupsUpsertWithWhereUniqueWithoutProjectsInput.schema';
import { groupsCreateManyProjectsInputEnvelopeObjectSchema } from './groupsCreateManyProjectsInputEnvelope.schema';
import { groupsWhereUniqueInputObjectSchema } from './groupsWhereUniqueInput.schema';
import { groupsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema } from './groupsUpdateWithWhereUniqueWithoutProjectsInput.schema';
import { groupsUpdateManyWithWhereWithoutProjectsInputObjectSchema } from './groupsUpdateManyWithWhereWithoutProjectsInput.schema';
import { groupsScalarWhereInputObjectSchema } from './groupsScalarWhereInput.schema'

export const groupsUncheckedUpdateManyWithoutProjectsNestedInputObjectSchema: z.ZodType<Prisma.groupsUncheckedUpdateManyWithoutProjectsNestedInput, Prisma.groupsUncheckedUpdateManyWithoutProjectsNestedInput> = z.object({
  create: z.union([z.lazy(() => groupsCreateWithoutProjectsInputObjectSchema), z.lazy(() => groupsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => groupsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => groupsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => groupsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => groupsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => groupsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => groupsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => groupsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => groupsWhereUniqueInputObjectSchema), z.lazy(() => groupsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => groupsWhereUniqueInputObjectSchema), z.lazy(() => groupsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => groupsWhereUniqueInputObjectSchema), z.lazy(() => groupsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => groupsWhereUniqueInputObjectSchema), z.lazy(() => groupsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => groupsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => groupsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => groupsUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => groupsUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => groupsScalarWhereInputObjectSchema), z.lazy(() => groupsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const groupsUncheckedUpdateManyWithoutProjectsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => groupsCreateWithoutProjectsInputObjectSchema), z.lazy(() => groupsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => groupsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => groupsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => groupsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => groupsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => groupsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => groupsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => groupsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => groupsWhereUniqueInputObjectSchema), z.lazy(() => groupsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => groupsWhereUniqueInputObjectSchema), z.lazy(() => groupsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => groupsWhereUniqueInputObjectSchema), z.lazy(() => groupsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => groupsWhereUniqueInputObjectSchema), z.lazy(() => groupsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => groupsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => groupsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => groupsUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => groupsUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => groupsScalarWhereInputObjectSchema), z.lazy(() => groupsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
