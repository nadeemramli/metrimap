// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { changelogWhereUniqueInputObjectSchema } from './changelogWhereUniqueInput.schema';
import { changelogUpdateWithoutUsersInputObjectSchema } from './changelogUpdateWithoutUsersInput.schema';
import { changelogUncheckedUpdateWithoutUsersInputObjectSchema } from './changelogUncheckedUpdateWithoutUsersInput.schema';
import { changelogCreateWithoutUsersInputObjectSchema } from './changelogCreateWithoutUsersInput.schema';
import { changelogUncheckedCreateWithoutUsersInputObjectSchema } from './changelogUncheckedCreateWithoutUsersInput.schema'

export const changelogUpsertWithWhereUniqueWithoutUsersInputObjectSchema: z.ZodType<Prisma.changelogUpsertWithWhereUniqueWithoutUsersInput, Prisma.changelogUpsertWithWhereUniqueWithoutUsersInput> = z.object({
  where: z.lazy(() => changelogWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => changelogUpdateWithoutUsersInputObjectSchema), z.lazy(() => changelogUncheckedUpdateWithoutUsersInputObjectSchema)]),
  create: z.union([z.lazy(() => changelogCreateWithoutUsersInputObjectSchema), z.lazy(() => changelogUncheckedCreateWithoutUsersInputObjectSchema)])
}).strict();
export const changelogUpsertWithWhereUniqueWithoutUsersInputObjectZodSchema = z.object({
  where: z.lazy(() => changelogWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => changelogUpdateWithoutUsersInputObjectSchema), z.lazy(() => changelogUncheckedUpdateWithoutUsersInputObjectSchema)]),
  create: z.union([z.lazy(() => changelogCreateWithoutUsersInputObjectSchema), z.lazy(() => changelogUncheckedCreateWithoutUsersInputObjectSchema)])
}).strict();
