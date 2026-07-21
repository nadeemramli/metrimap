// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsUpdateWithoutMetric_bindingsInputObjectSchema } from './connected_accountsUpdateWithoutMetric_bindingsInput.schema';
import { connected_accountsUncheckedUpdateWithoutMetric_bindingsInputObjectSchema } from './connected_accountsUncheckedUpdateWithoutMetric_bindingsInput.schema';
import { connected_accountsCreateWithoutMetric_bindingsInputObjectSchema } from './connected_accountsCreateWithoutMetric_bindingsInput.schema';
import { connected_accountsUncheckedCreateWithoutMetric_bindingsInputObjectSchema } from './connected_accountsUncheckedCreateWithoutMetric_bindingsInput.schema';
import { connected_accountsWhereInputObjectSchema } from './connected_accountsWhereInput.schema'

export const connected_accountsUpsertWithoutMetric_bindingsInputObjectSchema: z.ZodType<Prisma.connected_accountsUpsertWithoutMetric_bindingsInput, Prisma.connected_accountsUpsertWithoutMetric_bindingsInput> = z.object({
  update: z.union([z.lazy(() => connected_accountsUpdateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => connected_accountsUncheckedUpdateWithoutMetric_bindingsInputObjectSchema)]),
  create: z.union([z.lazy(() => connected_accountsCreateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutMetric_bindingsInputObjectSchema)]),
  where: z.lazy(() => connected_accountsWhereInputObjectSchema).optional()
}).strict();
export const connected_accountsUpsertWithoutMetric_bindingsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => connected_accountsUpdateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => connected_accountsUncheckedUpdateWithoutMetric_bindingsInputObjectSchema)]),
  create: z.union([z.lazy(() => connected_accountsCreateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutMetric_bindingsInputObjectSchema)]),
  where: z.lazy(() => connected_accountsWhereInputObjectSchema).optional()
}).strict();
