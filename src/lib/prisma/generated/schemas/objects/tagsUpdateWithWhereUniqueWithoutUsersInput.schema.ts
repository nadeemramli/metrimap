// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsWhereUniqueInputObjectSchema } from './tagsWhereUniqueInput.schema';
import { tagsUpdateWithoutUsersInputObjectSchema } from './tagsUpdateWithoutUsersInput.schema';
import { tagsUncheckedUpdateWithoutUsersInputObjectSchema } from './tagsUncheckedUpdateWithoutUsersInput.schema'

export const tagsUpdateWithWhereUniqueWithoutUsersInputObjectSchema: z.ZodType<Prisma.tagsUpdateWithWhereUniqueWithoutUsersInput, Prisma.tagsUpdateWithWhereUniqueWithoutUsersInput> = z.object({
  where: z.lazy(() => tagsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => tagsUpdateWithoutUsersInputObjectSchema), z.lazy(() => tagsUncheckedUpdateWithoutUsersInputObjectSchema)])
}).strict();
export const tagsUpdateWithWhereUniqueWithoutUsersInputObjectZodSchema = z.object({
  where: z.lazy(() => tagsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => tagsUpdateWithoutUsersInputObjectSchema), z.lazy(() => tagsUncheckedUpdateWithoutUsersInputObjectSchema)])
}).strict();
