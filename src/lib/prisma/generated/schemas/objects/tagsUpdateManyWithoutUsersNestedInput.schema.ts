// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsCreateWithoutUsersInputObjectSchema } from './tagsCreateWithoutUsersInput.schema';
import { tagsUncheckedCreateWithoutUsersInputObjectSchema } from './tagsUncheckedCreateWithoutUsersInput.schema';
import { tagsCreateOrConnectWithoutUsersInputObjectSchema } from './tagsCreateOrConnectWithoutUsersInput.schema';
import { tagsUpsertWithWhereUniqueWithoutUsersInputObjectSchema } from './tagsUpsertWithWhereUniqueWithoutUsersInput.schema';
import { tagsCreateManyUsersInputEnvelopeObjectSchema } from './tagsCreateManyUsersInputEnvelope.schema';
import { tagsWhereUniqueInputObjectSchema } from './tagsWhereUniqueInput.schema';
import { tagsUpdateWithWhereUniqueWithoutUsersInputObjectSchema } from './tagsUpdateWithWhereUniqueWithoutUsersInput.schema';
import { tagsUpdateManyWithWhereWithoutUsersInputObjectSchema } from './tagsUpdateManyWithWhereWithoutUsersInput.schema';
import { tagsScalarWhereInputObjectSchema } from './tagsScalarWhereInput.schema'

export const tagsUpdateManyWithoutUsersNestedInputObjectSchema: z.ZodType<Prisma.tagsUpdateManyWithoutUsersNestedInput, Prisma.tagsUpdateManyWithoutUsersNestedInput> = z.object({
  create: z.union([z.lazy(() => tagsCreateWithoutUsersInputObjectSchema), z.lazy(() => tagsCreateWithoutUsersInputObjectSchema).array(), z.lazy(() => tagsUncheckedCreateWithoutUsersInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutUsersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => tagsCreateOrConnectWithoutUsersInputObjectSchema), z.lazy(() => tagsCreateOrConnectWithoutUsersInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => tagsUpsertWithWhereUniqueWithoutUsersInputObjectSchema), z.lazy(() => tagsUpsertWithWhereUniqueWithoutUsersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => tagsCreateManyUsersInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => tagsWhereUniqueInputObjectSchema), z.lazy(() => tagsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => tagsWhereUniqueInputObjectSchema), z.lazy(() => tagsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => tagsWhereUniqueInputObjectSchema), z.lazy(() => tagsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => tagsWhereUniqueInputObjectSchema), z.lazy(() => tagsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => tagsUpdateWithWhereUniqueWithoutUsersInputObjectSchema), z.lazy(() => tagsUpdateWithWhereUniqueWithoutUsersInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => tagsUpdateManyWithWhereWithoutUsersInputObjectSchema), z.lazy(() => tagsUpdateManyWithWhereWithoutUsersInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => tagsScalarWhereInputObjectSchema), z.lazy(() => tagsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const tagsUpdateManyWithoutUsersNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => tagsCreateWithoutUsersInputObjectSchema), z.lazy(() => tagsCreateWithoutUsersInputObjectSchema).array(), z.lazy(() => tagsUncheckedCreateWithoutUsersInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutUsersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => tagsCreateOrConnectWithoutUsersInputObjectSchema), z.lazy(() => tagsCreateOrConnectWithoutUsersInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => tagsUpsertWithWhereUniqueWithoutUsersInputObjectSchema), z.lazy(() => tagsUpsertWithWhereUniqueWithoutUsersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => tagsCreateManyUsersInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => tagsWhereUniqueInputObjectSchema), z.lazy(() => tagsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => tagsWhereUniqueInputObjectSchema), z.lazy(() => tagsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => tagsWhereUniqueInputObjectSchema), z.lazy(() => tagsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => tagsWhereUniqueInputObjectSchema), z.lazy(() => tagsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => tagsUpdateWithWhereUniqueWithoutUsersInputObjectSchema), z.lazy(() => tagsUpdateWithWhereUniqueWithoutUsersInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => tagsUpdateManyWithWhereWithoutUsersInputObjectSchema), z.lazy(() => tagsUpdateManyWithWhereWithoutUsersInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => tagsScalarWhereInputObjectSchema), z.lazy(() => tagsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
