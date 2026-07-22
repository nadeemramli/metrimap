// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsCreateWithoutConnected_account_secretsInputObjectSchema } from './connected_accountsCreateWithoutConnected_account_secretsInput.schema';
import { connected_accountsUncheckedCreateWithoutConnected_account_secretsInputObjectSchema } from './connected_accountsUncheckedCreateWithoutConnected_account_secretsInput.schema';
import { connected_accountsCreateOrConnectWithoutConnected_account_secretsInputObjectSchema } from './connected_accountsCreateOrConnectWithoutConnected_account_secretsInput.schema';
import { connected_accountsWhereUniqueInputObjectSchema } from './connected_accountsWhereUniqueInput.schema'

export const connected_accountsCreateNestedOneWithoutConnected_account_secretsInputObjectSchema: z.ZodType<Prisma.connected_accountsCreateNestedOneWithoutConnected_account_secretsInput, Prisma.connected_accountsCreateNestedOneWithoutConnected_account_secretsInput> = z.object({
  create: z.union([z.lazy(() => connected_accountsCreateWithoutConnected_account_secretsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutConnected_account_secretsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => connected_accountsCreateOrConnectWithoutConnected_account_secretsInputObjectSchema).optional(),
  connect: z.lazy(() => connected_accountsWhereUniqueInputObjectSchema).optional()
}).strict();
export const connected_accountsCreateNestedOneWithoutConnected_account_secretsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => connected_accountsCreateWithoutConnected_account_secretsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutConnected_account_secretsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => connected_accountsCreateOrConnectWithoutConnected_account_secretsInputObjectSchema).optional(),
  connect: z.lazy(() => connected_accountsWhereUniqueInputObjectSchema).optional()
}).strict();
