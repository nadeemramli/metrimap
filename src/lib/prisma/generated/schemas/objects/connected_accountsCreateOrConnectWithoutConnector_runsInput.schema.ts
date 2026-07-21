// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsWhereUniqueInputObjectSchema } from './connected_accountsWhereUniqueInput.schema';
import { connected_accountsCreateWithoutConnector_runsInputObjectSchema } from './connected_accountsCreateWithoutConnector_runsInput.schema';
import { connected_accountsUncheckedCreateWithoutConnector_runsInputObjectSchema } from './connected_accountsUncheckedCreateWithoutConnector_runsInput.schema'

export const connected_accountsCreateOrConnectWithoutConnector_runsInputObjectSchema: z.ZodType<Prisma.connected_accountsCreateOrConnectWithoutConnector_runsInput, Prisma.connected_accountsCreateOrConnectWithoutConnector_runsInput> = z.object({
  where: z.lazy(() => connected_accountsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => connected_accountsCreateWithoutConnector_runsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutConnector_runsInputObjectSchema)])
}).strict();
export const connected_accountsCreateOrConnectWithoutConnector_runsInputObjectZodSchema = z.object({
  where: z.lazy(() => connected_accountsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => connected_accountsCreateWithoutConnector_runsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutConnector_runsInputObjectSchema)])
}).strict();
