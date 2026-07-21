// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsWhereUniqueInputObjectSchema } from './connected_accountsWhereUniqueInput.schema';
import { connected_accountsCreateWithoutConnected_account_secretsInputObjectSchema } from './connected_accountsCreateWithoutConnected_account_secretsInput.schema';
import { connected_accountsUncheckedCreateWithoutConnected_account_secretsInputObjectSchema } from './connected_accountsUncheckedCreateWithoutConnected_account_secretsInput.schema'

export const connected_accountsCreateOrConnectWithoutConnected_account_secretsInputObjectSchema: z.ZodType<Prisma.connected_accountsCreateOrConnectWithoutConnected_account_secretsInput, Prisma.connected_accountsCreateOrConnectWithoutConnected_account_secretsInput> = z.object({
  where: z.lazy(() => connected_accountsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => connected_accountsCreateWithoutConnected_account_secretsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutConnected_account_secretsInputObjectSchema)])
}).strict();
export const connected_accountsCreateOrConnectWithoutConnected_account_secretsInputObjectZodSchema = z.object({
  where: z.lazy(() => connected_accountsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => connected_accountsCreateWithoutConnected_account_secretsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutConnected_account_secretsInputObjectSchema)])
}).strict();
