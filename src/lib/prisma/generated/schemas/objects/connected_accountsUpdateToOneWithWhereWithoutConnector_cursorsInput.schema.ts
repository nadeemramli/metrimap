// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsWhereInputObjectSchema } from './connected_accountsWhereInput.schema';
import { connected_accountsUpdateWithoutConnector_cursorsInputObjectSchema } from './connected_accountsUpdateWithoutConnector_cursorsInput.schema';
import { connected_accountsUncheckedUpdateWithoutConnector_cursorsInputObjectSchema } from './connected_accountsUncheckedUpdateWithoutConnector_cursorsInput.schema'

export const connected_accountsUpdateToOneWithWhereWithoutConnector_cursorsInputObjectSchema: z.ZodType<Prisma.connected_accountsUpdateToOneWithWhereWithoutConnector_cursorsInput, Prisma.connected_accountsUpdateToOneWithWhereWithoutConnector_cursorsInput> = z.object({
  where: z.lazy(() => connected_accountsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => connected_accountsUpdateWithoutConnector_cursorsInputObjectSchema), z.lazy(() => connected_accountsUncheckedUpdateWithoutConnector_cursorsInputObjectSchema)])
}).strict();
export const connected_accountsUpdateToOneWithWhereWithoutConnector_cursorsInputObjectZodSchema = z.object({
  where: z.lazy(() => connected_accountsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => connected_accountsUpdateWithoutConnector_cursorsInputObjectSchema), z.lazy(() => connected_accountsUncheckedUpdateWithoutConnector_cursorsInputObjectSchema)])
}).strict();
