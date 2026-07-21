// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_account_secretsCreateWithoutConnected_accountsInputObjectSchema } from './connected_account_secretsCreateWithoutConnected_accountsInput.schema';
import { connected_account_secretsUncheckedCreateWithoutConnected_accountsInputObjectSchema } from './connected_account_secretsUncheckedCreateWithoutConnected_accountsInput.schema';
import { connected_account_secretsCreateOrConnectWithoutConnected_accountsInputObjectSchema } from './connected_account_secretsCreateOrConnectWithoutConnected_accountsInput.schema';
import { connected_account_secretsUpsertWithoutConnected_accountsInputObjectSchema } from './connected_account_secretsUpsertWithoutConnected_accountsInput.schema';
import { connected_account_secretsWhereInputObjectSchema } from './connected_account_secretsWhereInput.schema';
import { connected_account_secretsWhereUniqueInputObjectSchema } from './connected_account_secretsWhereUniqueInput.schema';
import { connected_account_secretsUpdateToOneWithWhereWithoutConnected_accountsInputObjectSchema } from './connected_account_secretsUpdateToOneWithWhereWithoutConnected_accountsInput.schema';
import { connected_account_secretsUpdateWithoutConnected_accountsInputObjectSchema } from './connected_account_secretsUpdateWithoutConnected_accountsInput.schema';
import { connected_account_secretsUncheckedUpdateWithoutConnected_accountsInputObjectSchema } from './connected_account_secretsUncheckedUpdateWithoutConnected_accountsInput.schema'

export const connected_account_secretsUpdateOneWithoutConnected_accountsNestedInputObjectSchema: z.ZodType<Prisma.connected_account_secretsUpdateOneWithoutConnected_accountsNestedInput, Prisma.connected_account_secretsUpdateOneWithoutConnected_accountsNestedInput> = z.object({
  create: z.union([z.lazy(() => connected_account_secretsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connected_account_secretsUncheckedCreateWithoutConnected_accountsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => connected_account_secretsCreateOrConnectWithoutConnected_accountsInputObjectSchema).optional(),
  upsert: z.lazy(() => connected_account_secretsUpsertWithoutConnected_accountsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => connected_account_secretsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => connected_account_secretsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => connected_account_secretsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => connected_account_secretsUpdateToOneWithWhereWithoutConnected_accountsInputObjectSchema), z.lazy(() => connected_account_secretsUpdateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connected_account_secretsUncheckedUpdateWithoutConnected_accountsInputObjectSchema)]).optional()
}).strict();
export const connected_account_secretsUpdateOneWithoutConnected_accountsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => connected_account_secretsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connected_account_secretsUncheckedCreateWithoutConnected_accountsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => connected_account_secretsCreateOrConnectWithoutConnected_accountsInputObjectSchema).optional(),
  upsert: z.lazy(() => connected_account_secretsUpsertWithoutConnected_accountsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => connected_account_secretsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => connected_account_secretsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => connected_account_secretsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => connected_account_secretsUpdateToOneWithWhereWithoutConnected_accountsInputObjectSchema), z.lazy(() => connected_account_secretsUpdateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connected_account_secretsUncheckedUpdateWithoutConnected_accountsInputObjectSchema)]).optional()
}).strict();
