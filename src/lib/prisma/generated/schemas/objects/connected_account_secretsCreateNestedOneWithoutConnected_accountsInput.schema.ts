// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_account_secretsCreateWithoutConnected_accountsInputObjectSchema } from './connected_account_secretsCreateWithoutConnected_accountsInput.schema';
import { connected_account_secretsUncheckedCreateWithoutConnected_accountsInputObjectSchema } from './connected_account_secretsUncheckedCreateWithoutConnected_accountsInput.schema';
import { connected_account_secretsCreateOrConnectWithoutConnected_accountsInputObjectSchema } from './connected_account_secretsCreateOrConnectWithoutConnected_accountsInput.schema';
import { connected_account_secretsWhereUniqueInputObjectSchema } from './connected_account_secretsWhereUniqueInput.schema'

export const connected_account_secretsCreateNestedOneWithoutConnected_accountsInputObjectSchema: z.ZodType<Prisma.connected_account_secretsCreateNestedOneWithoutConnected_accountsInput, Prisma.connected_account_secretsCreateNestedOneWithoutConnected_accountsInput> = z.object({
  create: z.union([z.lazy(() => connected_account_secretsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connected_account_secretsUncheckedCreateWithoutConnected_accountsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => connected_account_secretsCreateOrConnectWithoutConnected_accountsInputObjectSchema).optional(),
  connect: z.lazy(() => connected_account_secretsWhereUniqueInputObjectSchema).optional()
}).strict();
export const connected_account_secretsCreateNestedOneWithoutConnected_accountsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => connected_account_secretsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connected_account_secretsUncheckedCreateWithoutConnected_accountsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => connected_account_secretsCreateOrConnectWithoutConnected_accountsInputObjectSchema).optional(),
  connect: z.lazy(() => connected_account_secretsWhereUniqueInputObjectSchema).optional()
}).strict();
