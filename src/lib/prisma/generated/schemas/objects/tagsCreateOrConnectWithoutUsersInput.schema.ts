// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsWhereUniqueInputObjectSchema } from './tagsWhereUniqueInput.schema';
import { tagsCreateWithoutUsersInputObjectSchema } from './tagsCreateWithoutUsersInput.schema';
import { tagsUncheckedCreateWithoutUsersInputObjectSchema } from './tagsUncheckedCreateWithoutUsersInput.schema'

export const tagsCreateOrConnectWithoutUsersInputObjectSchema: z.ZodType<Prisma.tagsCreateOrConnectWithoutUsersInput, Prisma.tagsCreateOrConnectWithoutUsersInput> = z.object({
  where: z.lazy(() => tagsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => tagsCreateWithoutUsersInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutUsersInputObjectSchema)])
}).strict();
export const tagsCreateOrConnectWithoutUsersInputObjectZodSchema = z.object({
  where: z.lazy(() => tagsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => tagsCreateWithoutUsersInputObjectSchema), z.lazy(() => tagsUncheckedCreateWithoutUsersInputObjectSchema)])
}).strict();
