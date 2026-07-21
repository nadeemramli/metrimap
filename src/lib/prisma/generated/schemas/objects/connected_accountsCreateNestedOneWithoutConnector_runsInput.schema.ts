// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsCreateWithoutConnector_runsInputObjectSchema } from './connected_accountsCreateWithoutConnector_runsInput.schema';
import { connected_accountsUncheckedCreateWithoutConnector_runsInputObjectSchema } from './connected_accountsUncheckedCreateWithoutConnector_runsInput.schema';
import { connected_accountsCreateOrConnectWithoutConnector_runsInputObjectSchema } from './connected_accountsCreateOrConnectWithoutConnector_runsInput.schema';
import { connected_accountsWhereUniqueInputObjectSchema } from './connected_accountsWhereUniqueInput.schema'

export const connected_accountsCreateNestedOneWithoutConnector_runsInputObjectSchema: z.ZodType<Prisma.connected_accountsCreateNestedOneWithoutConnector_runsInput, Prisma.connected_accountsCreateNestedOneWithoutConnector_runsInput> = z.object({
  create: z.union([z.lazy(() => connected_accountsCreateWithoutConnector_runsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutConnector_runsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => connected_accountsCreateOrConnectWithoutConnector_runsInputObjectSchema).optional(),
  connect: z.lazy(() => connected_accountsWhereUniqueInputObjectSchema).optional()
}).strict();
export const connected_accountsCreateNestedOneWithoutConnector_runsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => connected_accountsCreateWithoutConnector_runsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutConnector_runsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => connected_accountsCreateOrConnectWithoutConnector_runsInputObjectSchema).optional(),
  connect: z.lazy(() => connected_accountsWhereUniqueInputObjectSchema).optional()
}).strict();
