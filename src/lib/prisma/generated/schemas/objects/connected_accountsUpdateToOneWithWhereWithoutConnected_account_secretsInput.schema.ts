// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsWhereInputObjectSchema } from './connected_accountsWhereInput.schema';
import { connected_accountsUpdateWithoutConnected_account_secretsInputObjectSchema } from './connected_accountsUpdateWithoutConnected_account_secretsInput.schema';
import { connected_accountsUncheckedUpdateWithoutConnected_account_secretsInputObjectSchema } from './connected_accountsUncheckedUpdateWithoutConnected_account_secretsInput.schema'

export const connected_accountsUpdateToOneWithWhereWithoutConnected_account_secretsInputObjectSchema: z.ZodType<Prisma.connected_accountsUpdateToOneWithWhereWithoutConnected_account_secretsInput, Prisma.connected_accountsUpdateToOneWithWhereWithoutConnected_account_secretsInput> = z.object({
  where: z.lazy(() => connected_accountsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => connected_accountsUpdateWithoutConnected_account_secretsInputObjectSchema), z.lazy(() => connected_accountsUncheckedUpdateWithoutConnected_account_secretsInputObjectSchema)])
}).strict();
export const connected_accountsUpdateToOneWithWhereWithoutConnected_account_secretsInputObjectZodSchema = z.object({
  where: z.lazy(() => connected_accountsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => connected_accountsUpdateWithoutConnected_account_secretsInputObjectSchema), z.lazy(() => connected_accountsUncheckedUpdateWithoutConnected_account_secretsInputObjectSchema)])
}).strict();
