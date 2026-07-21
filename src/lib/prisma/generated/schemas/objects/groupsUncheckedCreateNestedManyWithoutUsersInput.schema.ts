// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { groupsCreateWithoutUsersInputObjectSchema } from './groupsCreateWithoutUsersInput.schema';
import { groupsUncheckedCreateWithoutUsersInputObjectSchema } from './groupsUncheckedCreateWithoutUsersInput.schema';
import { groupsCreateOrConnectWithoutUsersInputObjectSchema } from './groupsCreateOrConnectWithoutUsersInput.schema';
import { groupsCreateManyUsersInputEnvelopeObjectSchema } from './groupsCreateManyUsersInputEnvelope.schema';
import { groupsWhereUniqueInputObjectSchema } from './groupsWhereUniqueInput.schema'

export const groupsUncheckedCreateNestedManyWithoutUsersInputObjectSchema: z.ZodType<Prisma.groupsUncheckedCreateNestedManyWithoutUsersInput, Prisma.groupsUncheckedCreateNestedManyWithoutUsersInput> = z.object({
  create: z.union([z.lazy(() => groupsCreateWithoutUsersInputObjectSchema), z.lazy(() => groupsCreateWithoutUsersInputObjectSchema).array(), z.lazy(() => groupsUncheckedCreateWithoutUsersInputObjectSchema), z.lazy(() => groupsUncheckedCreateWithoutUsersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => groupsCreateOrConnectWithoutUsersInputObjectSchema), z.lazy(() => groupsCreateOrConnectWithoutUsersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => groupsCreateManyUsersInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => groupsWhereUniqueInputObjectSchema), z.lazy(() => groupsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const groupsUncheckedCreateNestedManyWithoutUsersInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => groupsCreateWithoutUsersInputObjectSchema), z.lazy(() => groupsCreateWithoutUsersInputObjectSchema).array(), z.lazy(() => groupsUncheckedCreateWithoutUsersInputObjectSchema), z.lazy(() => groupsUncheckedCreateWithoutUsersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => groupsCreateOrConnectWithoutUsersInputObjectSchema), z.lazy(() => groupsCreateOrConnectWithoutUsersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => groupsCreateManyUsersInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => groupsWhereUniqueInputObjectSchema), z.lazy(() => groupsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
