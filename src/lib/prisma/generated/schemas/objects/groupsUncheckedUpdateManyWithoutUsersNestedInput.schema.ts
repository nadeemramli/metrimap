// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { groupsCreateWithoutUsersInputObjectSchema } from './groupsCreateWithoutUsersInput.schema';
import { groupsUncheckedCreateWithoutUsersInputObjectSchema } from './groupsUncheckedCreateWithoutUsersInput.schema';
import { groupsCreateOrConnectWithoutUsersInputObjectSchema } from './groupsCreateOrConnectWithoutUsersInput.schema';
import { groupsUpsertWithWhereUniqueWithoutUsersInputObjectSchema } from './groupsUpsertWithWhereUniqueWithoutUsersInput.schema';
import { groupsCreateManyUsersInputEnvelopeObjectSchema } from './groupsCreateManyUsersInputEnvelope.schema';
import { groupsWhereUniqueInputObjectSchema } from './groupsWhereUniqueInput.schema';
import { groupsUpdateWithWhereUniqueWithoutUsersInputObjectSchema } from './groupsUpdateWithWhereUniqueWithoutUsersInput.schema';
import { groupsUpdateManyWithWhereWithoutUsersInputObjectSchema } from './groupsUpdateManyWithWhereWithoutUsersInput.schema';
import { groupsScalarWhereInputObjectSchema } from './groupsScalarWhereInput.schema'

export const groupsUncheckedUpdateManyWithoutUsersNestedInputObjectSchema: z.ZodType<Prisma.groupsUncheckedUpdateManyWithoutUsersNestedInput, Prisma.groupsUncheckedUpdateManyWithoutUsersNestedInput> = z.object({
  create: z.union([z.lazy(() => groupsCreateWithoutUsersInputObjectSchema), z.lazy(() => groupsCreateWithoutUsersInputObjectSchema).array(), z.lazy(() => groupsUncheckedCreateWithoutUsersInputObjectSchema), z.lazy(() => groupsUncheckedCreateWithoutUsersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => groupsCreateOrConnectWithoutUsersInputObjectSchema), z.lazy(() => groupsCreateOrConnectWithoutUsersInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => groupsUpsertWithWhereUniqueWithoutUsersInputObjectSchema), z.lazy(() => groupsUpsertWithWhereUniqueWithoutUsersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => groupsCreateManyUsersInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => groupsWhereUniqueInputObjectSchema), z.lazy(() => groupsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => groupsWhereUniqueInputObjectSchema), z.lazy(() => groupsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => groupsWhereUniqueInputObjectSchema), z.lazy(() => groupsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => groupsWhereUniqueInputObjectSchema), z.lazy(() => groupsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => groupsUpdateWithWhereUniqueWithoutUsersInputObjectSchema), z.lazy(() => groupsUpdateWithWhereUniqueWithoutUsersInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => groupsUpdateManyWithWhereWithoutUsersInputObjectSchema), z.lazy(() => groupsUpdateManyWithWhereWithoutUsersInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => groupsScalarWhereInputObjectSchema), z.lazy(() => groupsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const groupsUncheckedUpdateManyWithoutUsersNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => groupsCreateWithoutUsersInputObjectSchema), z.lazy(() => groupsCreateWithoutUsersInputObjectSchema).array(), z.lazy(() => groupsUncheckedCreateWithoutUsersInputObjectSchema), z.lazy(() => groupsUncheckedCreateWithoutUsersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => groupsCreateOrConnectWithoutUsersInputObjectSchema), z.lazy(() => groupsCreateOrConnectWithoutUsersInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => groupsUpsertWithWhereUniqueWithoutUsersInputObjectSchema), z.lazy(() => groupsUpsertWithWhereUniqueWithoutUsersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => groupsCreateManyUsersInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => groupsWhereUniqueInputObjectSchema), z.lazy(() => groupsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => groupsWhereUniqueInputObjectSchema), z.lazy(() => groupsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => groupsWhereUniqueInputObjectSchema), z.lazy(() => groupsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => groupsWhereUniqueInputObjectSchema), z.lazy(() => groupsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => groupsUpdateWithWhereUniqueWithoutUsersInputObjectSchema), z.lazy(() => groupsUpdateWithWhereUniqueWithoutUsersInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => groupsUpdateManyWithWhereWithoutUsersInputObjectSchema), z.lazy(() => groupsUpdateManyWithWhereWithoutUsersInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => groupsScalarWhereInputObjectSchema), z.lazy(() => groupsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
