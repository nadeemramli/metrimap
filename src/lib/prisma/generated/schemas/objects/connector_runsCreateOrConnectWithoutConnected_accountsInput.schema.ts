// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connector_runsWhereUniqueInputObjectSchema } from './connector_runsWhereUniqueInput.schema';
import { connector_runsCreateWithoutConnected_accountsInputObjectSchema } from './connector_runsCreateWithoutConnected_accountsInput.schema';
import { connector_runsUncheckedCreateWithoutConnected_accountsInputObjectSchema } from './connector_runsUncheckedCreateWithoutConnected_accountsInput.schema'

export const connector_runsCreateOrConnectWithoutConnected_accountsInputObjectSchema: z.ZodType<Prisma.connector_runsCreateOrConnectWithoutConnected_accountsInput, Prisma.connector_runsCreateOrConnectWithoutConnected_accountsInput> = z.object({
  where: z.lazy(() => connector_runsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => connector_runsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_runsUncheckedCreateWithoutConnected_accountsInputObjectSchema)])
}).strict();
export const connector_runsCreateOrConnectWithoutConnected_accountsInputObjectZodSchema = z.object({
  where: z.lazy(() => connector_runsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => connector_runsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_runsUncheckedCreateWithoutConnected_accountsInputObjectSchema)])
}).strict();
