// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsWhereInputObjectSchema } from './connected_accountsWhereInput.schema';
import { connected_accountsUpdateWithoutConnector_runsInputObjectSchema } from './connected_accountsUpdateWithoutConnector_runsInput.schema';
import { connected_accountsUncheckedUpdateWithoutConnector_runsInputObjectSchema } from './connected_accountsUncheckedUpdateWithoutConnector_runsInput.schema'

export const connected_accountsUpdateToOneWithWhereWithoutConnector_runsInputObjectSchema: z.ZodType<Prisma.connected_accountsUpdateToOneWithWhereWithoutConnector_runsInput, Prisma.connected_accountsUpdateToOneWithWhereWithoutConnector_runsInput> = z.object({
  where: z.lazy(() => connected_accountsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => connected_accountsUpdateWithoutConnector_runsInputObjectSchema), z.lazy(() => connected_accountsUncheckedUpdateWithoutConnector_runsInputObjectSchema)])
}).strict();
export const connected_accountsUpdateToOneWithWhereWithoutConnector_runsInputObjectZodSchema = z.object({
  where: z.lazy(() => connected_accountsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => connected_accountsUpdateWithoutConnector_runsInputObjectSchema), z.lazy(() => connected_accountsUncheckedUpdateWithoutConnector_runsInputObjectSchema)])
}).strict();
