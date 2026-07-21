// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { groupsWhereUniqueInputObjectSchema } from './groupsWhereUniqueInput.schema';
import { groupsUpdateWithoutUsersInputObjectSchema } from './groupsUpdateWithoutUsersInput.schema';
import { groupsUncheckedUpdateWithoutUsersInputObjectSchema } from './groupsUncheckedUpdateWithoutUsersInput.schema';
import { groupsCreateWithoutUsersInputObjectSchema } from './groupsCreateWithoutUsersInput.schema';
import { groupsUncheckedCreateWithoutUsersInputObjectSchema } from './groupsUncheckedCreateWithoutUsersInput.schema'

export const groupsUpsertWithWhereUniqueWithoutUsersInputObjectSchema: z.ZodType<Prisma.groupsUpsertWithWhereUniqueWithoutUsersInput, Prisma.groupsUpsertWithWhereUniqueWithoutUsersInput> = z.object({
  where: z.lazy(() => groupsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => groupsUpdateWithoutUsersInputObjectSchema), z.lazy(() => groupsUncheckedUpdateWithoutUsersInputObjectSchema)]),
  create: z.union([z.lazy(() => groupsCreateWithoutUsersInputObjectSchema), z.lazy(() => groupsUncheckedCreateWithoutUsersInputObjectSchema)])
}).strict();
export const groupsUpsertWithWhereUniqueWithoutUsersInputObjectZodSchema = z.object({
  where: z.lazy(() => groupsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => groupsUpdateWithoutUsersInputObjectSchema), z.lazy(() => groupsUncheckedUpdateWithoutUsersInputObjectSchema)]),
  create: z.union([z.lazy(() => groupsCreateWithoutUsersInputObjectSchema), z.lazy(() => groupsUncheckedCreateWithoutUsersInputObjectSchema)])
}).strict();
