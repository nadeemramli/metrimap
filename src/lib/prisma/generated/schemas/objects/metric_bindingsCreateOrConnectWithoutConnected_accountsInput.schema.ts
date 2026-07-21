// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_bindingsWhereUniqueInputObjectSchema } from './metric_bindingsWhereUniqueInput.schema';
import { metric_bindingsCreateWithoutConnected_accountsInputObjectSchema } from './metric_bindingsCreateWithoutConnected_accountsInput.schema';
import { metric_bindingsUncheckedCreateWithoutConnected_accountsInputObjectSchema } from './metric_bindingsUncheckedCreateWithoutConnected_accountsInput.schema'

export const metric_bindingsCreateOrConnectWithoutConnected_accountsInputObjectSchema: z.ZodType<Prisma.metric_bindingsCreateOrConnectWithoutConnected_accountsInput, Prisma.metric_bindingsCreateOrConnectWithoutConnected_accountsInput> = z.object({
  where: z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_bindingsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => metric_bindingsUncheckedCreateWithoutConnected_accountsInputObjectSchema)])
}).strict();
export const metric_bindingsCreateOrConnectWithoutConnected_accountsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_bindingsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => metric_bindingsUncheckedCreateWithoutConnected_accountsInputObjectSchema)])
}).strict();
