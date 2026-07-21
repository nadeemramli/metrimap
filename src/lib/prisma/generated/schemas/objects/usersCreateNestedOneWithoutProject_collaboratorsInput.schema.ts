// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersCreateWithoutProject_collaboratorsInputObjectSchema } from './usersCreateWithoutProject_collaboratorsInput.schema';
import { usersUncheckedCreateWithoutProject_collaboratorsInputObjectSchema } from './usersUncheckedCreateWithoutProject_collaboratorsInput.schema';
import { usersCreateOrConnectWithoutProject_collaboratorsInputObjectSchema } from './usersCreateOrConnectWithoutProject_collaboratorsInput.schema';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema'

export const usersCreateNestedOneWithoutProject_collaboratorsInputObjectSchema: z.ZodType<Prisma.usersCreateNestedOneWithoutProject_collaboratorsInput, Prisma.usersCreateNestedOneWithoutProject_collaboratorsInput> = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutProject_collaboratorsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutProject_collaboratorsInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional()
}).strict();
export const usersCreateNestedOneWithoutProject_collaboratorsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutProject_collaboratorsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutProject_collaboratorsInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional()
}).strict();
