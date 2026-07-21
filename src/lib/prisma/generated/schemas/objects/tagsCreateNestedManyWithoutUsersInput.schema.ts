// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsCreateWithoutUsersInputObjectSchema } from './tagsCreateWithoutUsersInput.schema';
import { tagsUncheckedCreateWithoutUsersInputObjectSchema } from './tagsUncheckedCreateWithoutUsersInput.schema';
import { tagsCreateOrConnectWithoutUsersInputObjectSchema } from './tagsCreateOrConnectWithoutUsersInput.schema';
import { tagsCreateManyUsersInputEnvelopeObjectSchema } from './tagsCreateManyUsersInputEnvelope.schema';
import { tagsWhereUniqueInputObjectSchema } from './tagsWhereUniqueInput.schema'

export const tagsCreateNestedManyWithoutUsersInputObjectSchema: z.ZodType<Prisma.tagsCreateNestedManyWithoutUsersInput, Prisma.tagsCreateNestedManyWithoutUsersInput> = z.object({
  create: z.union([z.lazy(() => tagsCreateWithoutUsersInputObjectSchema), z.lazy(() => tagsCreateWithoutUsersInputObjectSchema).array(), z.lazy(() => tagsUncheckedCreateWithoutUsersInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutUsersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => tagsCreateOrConnectWithoutUsersInputObjectSchema), z.lazy(() => tagsCreateOrConnectWithoutUsersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => tagsCreateManyUsersInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => tagsWhereUniqueInputObjectSchema), z.lazy(() => tagsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const tagsCreateNestedManyWithoutUsersInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => tagsCreateWithoutUsersInputObjectSchema), z.lazy(() => tagsCreateWithoutUsersInputObjectSchema).array(), z.lazy(() => tagsUncheckedCreateWithoutUsersInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutUsersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => tagsCreateOrConnectWithoutUsersInputObjectSchema), z.lazy(() => tagsCreateOrConnectWithoutUsersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => tagsCreateManyUsersInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => tagsWhereUniqueInputObjectSchema), z.lazy(() => tagsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
