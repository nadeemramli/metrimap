// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsCreateWithoutConnected_account_secretsInputObjectSchema } from './connected_accountsCreateWithoutConnected_account_secretsInput.schema';
import { connected_accountsUncheckedCreateWithoutConnected_account_secretsInputObjectSchema } from './connected_accountsUncheckedCreateWithoutConnected_account_secretsInput.schema';
import { connected_accountsCreateOrConnectWithoutConnected_account_secretsInputObjectSchema } from './connected_accountsCreateOrConnectWithoutConnected_account_secretsInput.schema';
import { connected_accountsUpsertWithoutConnected_account_secretsInputObjectSchema } from './connected_accountsUpsertWithoutConnected_account_secretsInput.schema';
import { connected_accountsWhereUniqueInputObjectSchema } from './connected_accountsWhereUniqueInput.schema';
import { connected_accountsUpdateToOneWithWhereWithoutConnected_account_secretsInputObjectSchema } from './connected_accountsUpdateToOneWithWhereWithoutConnected_account_secretsInput.schema';
import { connected_accountsUpdateWithoutConnected_account_secretsInputObjectSchema } from './connected_accountsUpdateWithoutConnected_account_secretsInput.schema';
import { connected_accountsUncheckedUpdateWithoutConnected_account_secretsInputObjectSchema } from './connected_accountsUncheckedUpdateWithoutConnected_account_secretsInput.schema'

export const connected_accountsUpdateOneRequiredWithoutConnected_account_secretsNestedInputObjectSchema: z.ZodType<Prisma.connected_accountsUpdateOneRequiredWithoutConnected_account_secretsNestedInput, Prisma.connected_accountsUpdateOneRequiredWithoutConnected_account_secretsNestedInput> = z.object({
  create: z.union([z.lazy(() => connected_accountsCreateWithoutConnected_account_secretsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutConnected_account_secretsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => connected_accountsCreateOrConnectWithoutConnected_account_secretsInputObjectSchema).optional(),
  upsert: z.lazy(() => connected_accountsUpsertWithoutConnected_account_secretsInputObjectSchema).optional(),
  connect: z.lazy(() => connected_accountsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => connected_accountsUpdateToOneWithWhereWithoutConnected_account_secretsInputObjectSchema), z.lazy(() => connected_accountsUpdateWithoutConnected_account_secretsInputObjectSchema), z.lazy(() => connected_accountsUncheckedUpdateWithoutConnected_account_secretsInputObjectSchema)]).optional()
}).strict();
export const connected_accountsUpdateOneRequiredWithoutConnected_account_secretsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => connected_accountsCreateWithoutConnected_account_secretsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutConnected_account_secretsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => connected_accountsCreateOrConnectWithoutConnected_account_secretsInputObjectSchema).optional(),
  upsert: z.lazy(() => connected_accountsUpsertWithoutConnected_account_secretsInputObjectSchema).optional(),
  connect: z.lazy(() => connected_accountsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => connected_accountsUpdateToOneWithWhereWithoutConnected_account_secretsInputObjectSchema), z.lazy(() => connected_accountsUpdateWithoutConnected_account_secretsInputObjectSchema), z.lazy(() => connected_accountsUncheckedUpdateWithoutConnected_account_secretsInputObjectSchema)]).optional()
}).strict();
