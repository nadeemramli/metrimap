// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { changelogWhereUniqueInputObjectSchema } from './changelogWhereUniqueInput.schema';
import { changelogUpdateWithoutUsersInputObjectSchema } from './changelogUpdateWithoutUsersInput.schema';
import { changelogUncheckedUpdateWithoutUsersInputObjectSchema } from './changelogUncheckedUpdateWithoutUsersInput.schema'

export const changelogUpdateWithWhereUniqueWithoutUsersInputObjectSchema: z.ZodType<Prisma.changelogUpdateWithWhereUniqueWithoutUsersInput, Prisma.changelogUpdateWithWhereUniqueWithoutUsersInput> = z.object({
  where: z.lazy(() => changelogWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => changelogUpdateWithoutUsersInputObjectSchema), z.lazy(() => changelogUncheckedUpdateWithoutUsersInputObjectSchema)])
}).strict();
export const changelogUpdateWithWhereUniqueWithoutUsersInputObjectZodSchema = z.object({
  where: z.lazy(() => changelogWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => changelogUpdateWithoutUsersInputObjectSchema), z.lazy(() => changelogUncheckedUpdateWithoutUsersInputObjectSchema)])
}).strict();
