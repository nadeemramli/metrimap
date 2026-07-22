// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { changelogCreateWithoutUsersInputObjectSchema } from './changelogCreateWithoutUsersInput.schema';
import { changelogUncheckedCreateWithoutUsersInputObjectSchema } from './changelogUncheckedCreateWithoutUsersInput.schema';
import { changelogCreateOrConnectWithoutUsersInputObjectSchema } from './changelogCreateOrConnectWithoutUsersInput.schema';
import { changelogUpsertWithWhereUniqueWithoutUsersInputObjectSchema } from './changelogUpsertWithWhereUniqueWithoutUsersInput.schema';
import { changelogCreateManyUsersInputEnvelopeObjectSchema } from './changelogCreateManyUsersInputEnvelope.schema';
import { changelogWhereUniqueInputObjectSchema } from './changelogWhereUniqueInput.schema';
import { changelogUpdateWithWhereUniqueWithoutUsersInputObjectSchema } from './changelogUpdateWithWhereUniqueWithoutUsersInput.schema';
import { changelogUpdateManyWithWhereWithoutUsersInputObjectSchema } from './changelogUpdateManyWithWhereWithoutUsersInput.schema';
import { changelogScalarWhereInputObjectSchema } from './changelogScalarWhereInput.schema'

export const changelogUpdateManyWithoutUsersNestedInputObjectSchema: z.ZodType<Prisma.changelogUpdateManyWithoutUsersNestedInput, Prisma.changelogUpdateManyWithoutUsersNestedInput> = z.object({
  create: z.union([z.lazy(() => changelogCreateWithoutUsersInputObjectSchema), z.lazy(() => changelogCreateWithoutUsersInputObjectSchema).array(), z.lazy(() => changelogUncheckedCreateWithoutUsersInputObjectSchema), z.lazy(() => changelogUncheckedCreateWithoutUsersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => changelogCreateOrConnectWithoutUsersInputObjectSchema), z.lazy(() => changelogCreateOrConnectWithoutUsersInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => changelogUpsertWithWhereUniqueWithoutUsersInputObjectSchema), z.lazy(() => changelogUpsertWithWhereUniqueWithoutUsersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => changelogCreateManyUsersInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => changelogWhereUniqueInputObjectSchema), z.lazy(() => changelogWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => changelogWhereUniqueInputObjectSchema), z.lazy(() => changelogWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => changelogWhereUniqueInputObjectSchema), z.lazy(() => changelogWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => changelogWhereUniqueInputObjectSchema), z.lazy(() => changelogWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => changelogUpdateWithWhereUniqueWithoutUsersInputObjectSchema), z.lazy(() => changelogUpdateWithWhereUniqueWithoutUsersInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => changelogUpdateManyWithWhereWithoutUsersInputObjectSchema), z.lazy(() => changelogUpdateManyWithWhereWithoutUsersInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => changelogScalarWhereInputObjectSchema), z.lazy(() => changelogScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const changelogUpdateManyWithoutUsersNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => changelogCreateWithoutUsersInputObjectSchema), z.lazy(() => changelogCreateWithoutUsersInputObjectSchema).array(), z.lazy(() => changelogUncheckedCreateWithoutUsersInputObjectSchema), z.lazy(() => changelogUncheckedCreateWithoutUsersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => changelogCreateOrConnectWithoutUsersInputObjectSchema), z.lazy(() => changelogCreateOrConnectWithoutUsersInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => changelogUpsertWithWhereUniqueWithoutUsersInputObjectSchema), z.lazy(() => changelogUpsertWithWhereUniqueWithoutUsersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => changelogCreateManyUsersInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => changelogWhereUniqueInputObjectSchema), z.lazy(() => changelogWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => changelogWhereUniqueInputObjectSchema), z.lazy(() => changelogWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => changelogWhereUniqueInputObjectSchema), z.lazy(() => changelogWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => changelogWhereUniqueInputObjectSchema), z.lazy(() => changelogWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => changelogUpdateWithWhereUniqueWithoutUsersInputObjectSchema), z.lazy(() => changelogUpdateWithWhereUniqueWithoutUsersInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => changelogUpdateManyWithWhereWithoutUsersInputObjectSchema), z.lazy(() => changelogUpdateManyWithWhereWithoutUsersInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => changelogScalarWhereInputObjectSchema), z.lazy(() => changelogScalarWhereInputObjectSchema).array()]).optional()
}).strict();
