// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsWhereUniqueInputObjectSchema } from './tagsWhereUniqueInput.schema';
import { tagsUpdateWithoutUsersInputObjectSchema } from './tagsUpdateWithoutUsersInput.schema';
import { tagsUncheckedUpdateWithoutUsersInputObjectSchema } from './tagsUncheckedUpdateWithoutUsersInput.schema';
import { tagsCreateWithoutUsersInputObjectSchema } from './tagsCreateWithoutUsersInput.schema';
import { tagsUncheckedCreateWithoutUsersInputObjectSchema } from './tagsUncheckedCreateWithoutUsersInput.schema'

export const tagsUpsertWithWhereUniqueWithoutUsersInputObjectSchema: z.ZodType<Prisma.tagsUpsertWithWhereUniqueWithoutUsersInput, Prisma.tagsUpsertWithWhereUniqueWithoutUsersInput> = z.object({
  where: z.lazy(() => tagsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => tagsUpdateWithoutUsersInputObjectSchema), z.lazy(() => tagsUncheckedUpdateWithoutUsersInputObjectSchema)]),
  create: z.union([z.lazy(() => tagsCreateWithoutUsersInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutUsersInputObjectSchema)])
}).strict();
export const tagsUpsertWithWhereUniqueWithoutUsersInputObjectZodSchema = z.object({
  where: z.lazy(() => tagsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => tagsUpdateWithoutUsersInputObjectSchema), z.lazy(() => tagsUncheckedUpdateWithoutUsersInputObjectSchema)]),
  create: z.union([z.lazy(() => tagsCreateWithoutUsersInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutUsersInputObjectSchema)])
}).strict();
