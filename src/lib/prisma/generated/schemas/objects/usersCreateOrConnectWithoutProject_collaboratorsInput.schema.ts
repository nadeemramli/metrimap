// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema';
import { usersCreateWithoutProject_collaboratorsInputObjectSchema } from './usersCreateWithoutProject_collaboratorsInput.schema';
import { usersUncheckedCreateWithoutProject_collaboratorsInputObjectSchema } from './usersUncheckedCreateWithoutProject_collaboratorsInput.schema'

export const usersCreateOrConnectWithoutProject_collaboratorsInputObjectSchema: z.ZodType<Prisma.usersCreateOrConnectWithoutProject_collaboratorsInput, Prisma.usersCreateOrConnectWithoutProject_collaboratorsInput> = z.object({
  where: z.lazy(() => usersWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => usersCreateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutProject_collaboratorsInputObjectSchema)])
}).strict();
export const usersCreateOrConnectWithoutProject_collaboratorsInputObjectZodSchema = z.object({
  where: z.lazy(() => usersWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => usersCreateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutProject_collaboratorsInputObjectSchema)])
}).strict();
