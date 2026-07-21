// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { groupsWhereUniqueInputObjectSchema } from './groupsWhereUniqueInput.schema';
import { groupsUpdateWithoutUsersInputObjectSchema } from './groupsUpdateWithoutUsersInput.schema';
import { groupsUncheckedUpdateWithoutUsersInputObjectSchema } from './groupsUncheckedUpdateWithoutUsersInput.schema'

export const groupsUpdateWithWhereUniqueWithoutUsersInputObjectSchema: z.ZodType<Prisma.groupsUpdateWithWhereUniqueWithoutUsersInput, Prisma.groupsUpdateWithWhereUniqueWithoutUsersInput> = z.object({
  where: z.lazy(() => groupsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => groupsUpdateWithoutUsersInputObjectSchema), z.lazy(() => groupsUncheckedUpdateWithoutUsersInputObjectSchema)])
}).strict();
export const groupsUpdateWithWhereUniqueWithoutUsersInputObjectZodSchema = z.object({
  where: z.lazy(() => groupsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => groupsUpdateWithoutUsersInputObjectSchema), z.lazy(() => groupsUncheckedUpdateWithoutUsersInputObjectSchema)])
}).strict();
