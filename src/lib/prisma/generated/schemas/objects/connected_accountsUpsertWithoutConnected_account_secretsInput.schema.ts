// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsUpdateWithoutConnected_account_secretsInputObjectSchema } from './connected_accountsUpdateWithoutConnected_account_secretsInput.schema';
import { connected_accountsUncheckedUpdateWithoutConnected_account_secretsInputObjectSchema } from './connected_accountsUncheckedUpdateWithoutConnected_account_secretsInput.schema';
import { connected_accountsCreateWithoutConnected_account_secretsInputObjectSchema } from './connected_accountsCreateWithoutConnected_account_secretsInput.schema';
import { connected_accountsUncheckedCreateWithoutConnected_account_secretsInputObjectSchema } from './connected_accountsUncheckedCreateWithoutConnected_account_secretsInput.schema';
import { connected_accountsWhereInputObjectSchema } from './connected_accountsWhereInput.schema'

export const connected_accountsUpsertWithoutConnected_account_secretsInputObjectSchema: z.ZodType<Prisma.connected_accountsUpsertWithoutConnected_account_secretsInput, Prisma.connected_accountsUpsertWithoutConnected_account_secretsInput> = z.object({
  update: z.union([z.lazy(() => connected_accountsUpdateWithoutConnected_account_secretsInputObjectSchema), z.lazy(() => connected_accountsUncheckedUpdateWithoutConnected_account_secretsInputObjectSchema)]),
  create: z.union([z.lazy(() => connected_accountsCreateWithoutConnected_account_secretsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutConnected_account_secretsInputObjectSchema)]),
  where: z.lazy(() => connected_accountsWhereInputObjectSchema).optional()
}).strict();
export const connected_accountsUpsertWithoutConnected_account_secretsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => connected_accountsUpdateWithoutConnected_account_secretsInputObjectSchema), z.lazy(() => connected_accountsUncheckedUpdateWithoutConnected_account_secretsInputObjectSchema)]),
  create: z.union([z.lazy(() => connected_accountsCreateWithoutConnected_account_secretsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutConnected_account_secretsInputObjectSchema)]),
  where: z.lazy(() => connected_accountsWhereInputObjectSchema).optional()
}).strict();
