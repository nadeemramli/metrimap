// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_account_secretsWhereInputObjectSchema } from './connected_account_secretsWhereInput.schema';
import { connected_account_secretsUpdateWithoutConnected_accountsInputObjectSchema } from './connected_account_secretsUpdateWithoutConnected_accountsInput.schema';
import { connected_account_secretsUncheckedUpdateWithoutConnected_accountsInputObjectSchema } from './connected_account_secretsUncheckedUpdateWithoutConnected_accountsInput.schema'

export const connected_account_secretsUpdateToOneWithWhereWithoutConnected_accountsInputObjectSchema: z.ZodType<Prisma.connected_account_secretsUpdateToOneWithWhereWithoutConnected_accountsInput, Prisma.connected_account_secretsUpdateToOneWithWhereWithoutConnected_accountsInput> = z.object({
  where: z.lazy(() => connected_account_secretsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => connected_account_secretsUpdateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connected_account_secretsUncheckedUpdateWithoutConnected_accountsInputObjectSchema)])
}).strict();
export const connected_account_secretsUpdateToOneWithWhereWithoutConnected_accountsInputObjectZodSchema = z.object({
  where: z.lazy(() => connected_account_secretsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => connected_account_secretsUpdateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connected_account_secretsUncheckedUpdateWithoutConnected_accountsInputObjectSchema)])
}).strict();
