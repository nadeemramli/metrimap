// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { changelogCreateWithoutUsersInputObjectSchema } from './changelogCreateWithoutUsersInput.schema';
import { changelogUncheckedCreateWithoutUsersInputObjectSchema } from './changelogUncheckedCreateWithoutUsersInput.schema';
import { changelogCreateOrConnectWithoutUsersInputObjectSchema } from './changelogCreateOrConnectWithoutUsersInput.schema';
import { changelogCreateManyUsersInputEnvelopeObjectSchema } from './changelogCreateManyUsersInputEnvelope.schema';
import { changelogWhereUniqueInputObjectSchema } from './changelogWhereUniqueInput.schema'

export const changelogUncheckedCreateNestedManyWithoutUsersInputObjectSchema: z.ZodType<Prisma.changelogUncheckedCreateNestedManyWithoutUsersInput, Prisma.changelogUncheckedCreateNestedManyWithoutUsersInput> = z.object({
  create: z.union([z.lazy(() => changelogCreateWithoutUsersInputObjectSchema), z.lazy(() => changelogCreateWithoutUsersInputObjectSchema).array(), z.lazy(() => changelogUncheckedCreateWithoutUsersInputObjectSchema), z.lazy(() => changelogUncheckedCreateWithoutUsersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => changelogCreateOrConnectWithoutUsersInputObjectSchema), z.lazy(() => changelogCreateOrConnectWithoutUsersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => changelogCreateManyUsersInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => changelogWhereUniqueInputObjectSchema), z.lazy(() => changelogWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const changelogUncheckedCreateNestedManyWithoutUsersInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => changelogCreateWithoutUsersInputObjectSchema), z.lazy(() => changelogCreateWithoutUsersInputObjectSchema).array(), z.lazy(() => changelogUncheckedCreateWithoutUsersInputObjectSchema), z.lazy(() => changelogUncheckedCreateWithoutUsersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => changelogCreateOrConnectWithoutUsersInputObjectSchema), z.lazy(() => changelogCreateOrConnectWithoutUsersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => changelogCreateManyUsersInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => changelogWhereUniqueInputObjectSchema), z.lazy(() => changelogWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
