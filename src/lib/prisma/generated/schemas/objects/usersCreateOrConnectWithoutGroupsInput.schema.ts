// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema';
import { usersCreateWithoutGroupsInputObjectSchema } from './usersCreateWithoutGroupsInput.schema';
import { usersUncheckedCreateWithoutGroupsInputObjectSchema } from './usersUncheckedCreateWithoutGroupsInput.schema'

export const usersCreateOrConnectWithoutGroupsInputObjectSchema: z.ZodType<Prisma.usersCreateOrConnectWithoutGroupsInput, Prisma.usersCreateOrConnectWithoutGroupsInput> = z.object({
  where: z.lazy(() => usersWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => usersCreateWithoutGroupsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutGroupsInputObjectSchema)])
}).strict();
export const usersCreateOrConnectWithoutGroupsInputObjectZodSchema = z.object({
  where: z.lazy(() => usersWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => usersCreateWithoutGroupsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutGroupsInputObjectSchema)])
}).strict();
