// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersCreateWithoutGroupsInputObjectSchema } from './usersCreateWithoutGroupsInput.schema';
import { usersUncheckedCreateWithoutGroupsInputObjectSchema } from './usersUncheckedCreateWithoutGroupsInput.schema';
import { usersCreateOrConnectWithoutGroupsInputObjectSchema } from './usersCreateOrConnectWithoutGroupsInput.schema';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema'

export const usersCreateNestedOneWithoutGroupsInputObjectSchema: z.ZodType<Prisma.usersCreateNestedOneWithoutGroupsInput, Prisma.usersCreateNestedOneWithoutGroupsInput> = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutGroupsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutGroupsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutGroupsInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional()
}).strict();
export const usersCreateNestedOneWithoutGroupsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutGroupsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutGroupsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutGroupsInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional()
}).strict();
