// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsCreateWithoutMetric_bindingsInputObjectSchema } from './connected_accountsCreateWithoutMetric_bindingsInput.schema';
import { connected_accountsUncheckedCreateWithoutMetric_bindingsInputObjectSchema } from './connected_accountsUncheckedCreateWithoutMetric_bindingsInput.schema';
import { connected_accountsCreateOrConnectWithoutMetric_bindingsInputObjectSchema } from './connected_accountsCreateOrConnectWithoutMetric_bindingsInput.schema';
import { connected_accountsWhereUniqueInputObjectSchema } from './connected_accountsWhereUniqueInput.schema'

export const connected_accountsCreateNestedOneWithoutMetric_bindingsInputObjectSchema: z.ZodType<Prisma.connected_accountsCreateNestedOneWithoutMetric_bindingsInput, Prisma.connected_accountsCreateNestedOneWithoutMetric_bindingsInput> = z.object({
  create: z.union([z.lazy(() => connected_accountsCreateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutMetric_bindingsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => connected_accountsCreateOrConnectWithoutMetric_bindingsInputObjectSchema).optional(),
  connect: z.lazy(() => connected_accountsWhereUniqueInputObjectSchema).optional()
}).strict();
export const connected_accountsCreateNestedOneWithoutMetric_bindingsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => connected_accountsCreateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutMetric_bindingsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => connected_accountsCreateOrConnectWithoutMetric_bindingsInputObjectSchema).optional(),
  connect: z.lazy(() => connected_accountsWhereUniqueInputObjectSchema).optional()
}).strict();
