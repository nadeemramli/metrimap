// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsUpdateWithoutConnector_cursorsInputObjectSchema } from './connected_accountsUpdateWithoutConnector_cursorsInput.schema';
import { connected_accountsUncheckedUpdateWithoutConnector_cursorsInputObjectSchema } from './connected_accountsUncheckedUpdateWithoutConnector_cursorsInput.schema';
import { connected_accountsCreateWithoutConnector_cursorsInputObjectSchema } from './connected_accountsCreateWithoutConnector_cursorsInput.schema';
import { connected_accountsUncheckedCreateWithoutConnector_cursorsInputObjectSchema } from './connected_accountsUncheckedCreateWithoutConnector_cursorsInput.schema';
import { connected_accountsWhereInputObjectSchema } from './connected_accountsWhereInput.schema'

export const connected_accountsUpsertWithoutConnector_cursorsInputObjectSchema: z.ZodType<Prisma.connected_accountsUpsertWithoutConnector_cursorsInput, Prisma.connected_accountsUpsertWithoutConnector_cursorsInput> = z.object({
  update: z.union([z.lazy(() => connected_accountsUpdateWithoutConnector_cursorsInputObjectSchema), z.lazy(() => connected_accountsUncheckedUpdateWithoutConnector_cursorsInputObjectSchema)]),
  create: z.union([z.lazy(() => connected_accountsCreateWithoutConnector_cursorsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutConnector_cursorsInputObjectSchema)]),
  where: z.lazy(() => connected_accountsWhereInputObjectSchema).optional()
}).strict();
export const connected_accountsUpsertWithoutConnector_cursorsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => connected_accountsUpdateWithoutConnector_cursorsInputObjectSchema), z.lazy(() => connected_accountsUncheckedUpdateWithoutConnector_cursorsInputObjectSchema)]),
  create: z.union([z.lazy(() => connected_accountsCreateWithoutConnector_cursorsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutConnector_cursorsInputObjectSchema)]),
  where: z.lazy(() => connected_accountsWhereInputObjectSchema).optional()
}).strict();
