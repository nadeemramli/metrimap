// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_account_secretsUpdateWithoutConnected_accountsInputObjectSchema } from './connected_account_secretsUpdateWithoutConnected_accountsInput.schema';
import { connected_account_secretsUncheckedUpdateWithoutConnected_accountsInputObjectSchema } from './connected_account_secretsUncheckedUpdateWithoutConnected_accountsInput.schema';
import { connected_account_secretsCreateWithoutConnected_accountsInputObjectSchema } from './connected_account_secretsCreateWithoutConnected_accountsInput.schema';
import { connected_account_secretsUncheckedCreateWithoutConnected_accountsInputObjectSchema } from './connected_account_secretsUncheckedCreateWithoutConnected_accountsInput.schema';
import { connected_account_secretsWhereInputObjectSchema } from './connected_account_secretsWhereInput.schema'

export const connected_account_secretsUpsertWithoutConnected_accountsInputObjectSchema: z.ZodType<Prisma.connected_account_secretsUpsertWithoutConnected_accountsInput, Prisma.connected_account_secretsUpsertWithoutConnected_accountsInput> = z.object({
  update: z.union([z.lazy(() => connected_account_secretsUpdateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connected_account_secretsUncheckedUpdateWithoutConnected_accountsInputObjectSchema)]),
  create: z.union([z.lazy(() => connected_account_secretsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connected_account_secretsUncheckedCreateWithoutConnected_accountsInputObjectSchema)]),
  where: z.lazy(() => connected_account_secretsWhereInputObjectSchema).optional()
}).strict();
export const connected_account_secretsUpsertWithoutConnected_accountsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => connected_account_secretsUpdateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connected_account_secretsUncheckedUpdateWithoutConnected_accountsInputObjectSchema)]),
  create: z.union([z.lazy(() => connected_account_secretsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connected_account_secretsUncheckedCreateWithoutConnected_accountsInputObjectSchema)]),
  where: z.lazy(() => connected_account_secretsWhereInputObjectSchema).optional()
}).strict();
