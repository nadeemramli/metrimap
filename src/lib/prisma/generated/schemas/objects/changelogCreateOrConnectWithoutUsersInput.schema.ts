// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { changelogWhereUniqueInputObjectSchema } from './changelogWhereUniqueInput.schema';
import { changelogCreateWithoutUsersInputObjectSchema } from './changelogCreateWithoutUsersInput.schema';
import { changelogUncheckedCreateWithoutUsersInputObjectSchema } from './changelogUncheckedCreateWithoutUsersInput.schema'

export const changelogCreateOrConnectWithoutUsersInputObjectSchema: z.ZodType<Prisma.changelogCreateOrConnectWithoutUsersInput, Prisma.changelogCreateOrConnectWithoutUsersInput> = z.object({
  where: z.lazy(() => changelogWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => changelogCreateWithoutUsersInputObjectSchema), z.lazy(() => changelogUncheckedCreateWithoutUsersInputObjectSchema)])
}).strict();
export const changelogCreateOrConnectWithoutUsersInputObjectZodSchema = z.object({
  where: z.lazy(() => changelogWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => changelogCreateWithoutUsersInputObjectSchema), z.lazy(() => changelogUncheckedCreateWithoutUsersInputObjectSchema)])
}).strict();
