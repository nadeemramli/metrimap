// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsWhereInputObjectSchema } from './connected_accountsWhereInput.schema';
import { connected_accountsUpdateWithoutMetric_bindingsInputObjectSchema } from './connected_accountsUpdateWithoutMetric_bindingsInput.schema';
import { connected_accountsUncheckedUpdateWithoutMetric_bindingsInputObjectSchema } from './connected_accountsUncheckedUpdateWithoutMetric_bindingsInput.schema'

export const connected_accountsUpdateToOneWithWhereWithoutMetric_bindingsInputObjectSchema: z.ZodType<Prisma.connected_accountsUpdateToOneWithWhereWithoutMetric_bindingsInput, Prisma.connected_accountsUpdateToOneWithWhereWithoutMetric_bindingsInput> = z.object({
  where: z.lazy(() => connected_accountsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => connected_accountsUpdateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => connected_accountsUncheckedUpdateWithoutMetric_bindingsInputObjectSchema)])
}).strict();
export const connected_accountsUpdateToOneWithWhereWithoutMetric_bindingsInputObjectZodSchema = z.object({
  where: z.lazy(() => connected_accountsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => connected_accountsUpdateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => connected_accountsUncheckedUpdateWithoutMetric_bindingsInputObjectSchema)])
}).strict();
