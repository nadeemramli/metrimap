// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsUpdateWithoutConnector_runsInputObjectSchema } from './connected_accountsUpdateWithoutConnector_runsInput.schema';
import { connected_accountsUncheckedUpdateWithoutConnector_runsInputObjectSchema } from './connected_accountsUncheckedUpdateWithoutConnector_runsInput.schema';
import { connected_accountsCreateWithoutConnector_runsInputObjectSchema } from './connected_accountsCreateWithoutConnector_runsInput.schema';
import { connected_accountsUncheckedCreateWithoutConnector_runsInputObjectSchema } from './connected_accountsUncheckedCreateWithoutConnector_runsInput.schema';
import { connected_accountsWhereInputObjectSchema } from './connected_accountsWhereInput.schema'

export const connected_accountsUpsertWithoutConnector_runsInputObjectSchema: z.ZodType<Prisma.connected_accountsUpsertWithoutConnector_runsInput, Prisma.connected_accountsUpsertWithoutConnector_runsInput> = z.object({
  update: z.union([z.lazy(() => connected_accountsUpdateWithoutConnector_runsInputObjectSchema), z.lazy(() => connected_accountsUncheckedUpdateWithoutConnector_runsInputObjectSchema)]),
  create: z.union([z.lazy(() => connected_accountsCreateWithoutConnector_runsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutConnector_runsInputObjectSchema)]),
  where: z.lazy(() => connected_accountsWhereInputObjectSchema).optional()
}).strict();
export const connected_accountsUpsertWithoutConnector_runsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => connected_accountsUpdateWithoutConnector_runsInputObjectSchema), z.lazy(() => connected_accountsUncheckedUpdateWithoutConnector_runsInputObjectSchema)]),
  create: z.union([z.lazy(() => connected_accountsCreateWithoutConnector_runsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutConnector_runsInputObjectSchema)]),
  where: z.lazy(() => connected_accountsWhereInputObjectSchema).optional()
}).strict();
