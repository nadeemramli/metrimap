// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_account_secretsWhereUniqueInputObjectSchema } from './connected_account_secretsWhereUniqueInput.schema';
import { connected_account_secretsCreateWithoutConnected_accountsInputObjectSchema } from './connected_account_secretsCreateWithoutConnected_accountsInput.schema';
import { connected_account_secretsUncheckedCreateWithoutConnected_accountsInputObjectSchema } from './connected_account_secretsUncheckedCreateWithoutConnected_accountsInput.schema'

export const connected_account_secretsCreateOrConnectWithoutConnected_accountsInputObjectSchema: z.ZodType<Prisma.connected_account_secretsCreateOrConnectWithoutConnected_accountsInput, Prisma.connected_account_secretsCreateOrConnectWithoutConnected_accountsInput> = z.object({
  where: z.lazy(() => connected_account_secretsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => connected_account_secretsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connected_account_secretsUncheckedCreateWithoutConnected_accountsInputObjectSchema)])
}).strict();
export const connected_account_secretsCreateOrConnectWithoutConnected_accountsInputObjectZodSchema = z.object({
  where: z.lazy(() => connected_account_secretsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => connected_account_secretsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connected_account_secretsUncheckedCreateWithoutConnected_accountsInputObjectSchema)])
}).strict();
