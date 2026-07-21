// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsWhereUniqueInputObjectSchema } from './connected_accountsWhereUniqueInput.schema';
import { connected_accountsCreateWithoutMetric_bindingsInputObjectSchema } from './connected_accountsCreateWithoutMetric_bindingsInput.schema';
import { connected_accountsUncheckedCreateWithoutMetric_bindingsInputObjectSchema } from './connected_accountsUncheckedCreateWithoutMetric_bindingsInput.schema'

export const connected_accountsCreateOrConnectWithoutMetric_bindingsInputObjectSchema: z.ZodType<Prisma.connected_accountsCreateOrConnectWithoutMetric_bindingsInput, Prisma.connected_accountsCreateOrConnectWithoutMetric_bindingsInput> = z.object({
  where: z.lazy(() => connected_accountsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => connected_accountsCreateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutMetric_bindingsInputObjectSchema)])
}).strict();
export const connected_accountsCreateOrConnectWithoutMetric_bindingsInputObjectZodSchema = z.object({
  where: z.lazy(() => connected_accountsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => connected_accountsCreateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutMetric_bindingsInputObjectSchema)])
}).strict();
