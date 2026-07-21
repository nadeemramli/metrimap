// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsWhereUniqueInputObjectSchema } from './connected_accountsWhereUniqueInput.schema';
import { connected_accountsCreateWithoutConnector_cursorsInputObjectSchema } from './connected_accountsCreateWithoutConnector_cursorsInput.schema';
import { connected_accountsUncheckedCreateWithoutConnector_cursorsInputObjectSchema } from './connected_accountsUncheckedCreateWithoutConnector_cursorsInput.schema'

export const connected_accountsCreateOrConnectWithoutConnector_cursorsInputObjectSchema: z.ZodType<Prisma.connected_accountsCreateOrConnectWithoutConnector_cursorsInput, Prisma.connected_accountsCreateOrConnectWithoutConnector_cursorsInput> = z.object({
  where: z.lazy(() => connected_accountsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => connected_accountsCreateWithoutConnector_cursorsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutConnector_cursorsInputObjectSchema)])
}).strict();
export const connected_accountsCreateOrConnectWithoutConnector_cursorsInputObjectZodSchema = z.object({
  where: z.lazy(() => connected_accountsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => connected_accountsCreateWithoutConnector_cursorsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutConnector_cursorsInputObjectSchema)])
}).strict();
