// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { groupsWhereUniqueInputObjectSchema } from './groupsWhereUniqueInput.schema';
import { groupsCreateWithoutUsersInputObjectSchema } from './groupsCreateWithoutUsersInput.schema';
import { groupsUncheckedCreateWithoutUsersInputObjectSchema } from './groupsUncheckedCreateWithoutUsersInput.schema'

export const groupsCreateOrConnectWithoutUsersInputObjectSchema: z.ZodType<Prisma.groupsCreateOrConnectWithoutUsersInput, Prisma.groupsCreateOrConnectWithoutUsersInput> = z.object({
  where: z.lazy(() => groupsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => groupsCreateWithoutUsersInputObjectSchema), z.lazy(() => groupsUncheckedCreateWithoutUsersInputObjectSchema)])
}).strict();
export const groupsCreateOrConnectWithoutUsersInputObjectZodSchema = z.object({
  where: z.lazy(() => groupsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => groupsCreateWithoutUsersInputObjectSchema), z.lazy(() => groupsUncheckedCreateWithoutUsersInputObjectSchema)])
}).strict();
