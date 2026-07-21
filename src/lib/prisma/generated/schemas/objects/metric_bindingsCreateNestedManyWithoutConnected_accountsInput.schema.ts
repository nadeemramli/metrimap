// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_bindingsCreateWithoutConnected_accountsInputObjectSchema } from './metric_bindingsCreateWithoutConnected_accountsInput.schema';
import { metric_bindingsUncheckedCreateWithoutConnected_accountsInputObjectSchema } from './metric_bindingsUncheckedCreateWithoutConnected_accountsInput.schema';
import { metric_bindingsCreateOrConnectWithoutConnected_accountsInputObjectSchema } from './metric_bindingsCreateOrConnectWithoutConnected_accountsInput.schema';
import { metric_bindingsCreateManyConnected_accountsInputEnvelopeObjectSchema } from './metric_bindingsCreateManyConnected_accountsInputEnvelope.schema';
import { metric_bindingsWhereUniqueInputObjectSchema } from './metric_bindingsWhereUniqueInput.schema'

export const metric_bindingsCreateNestedManyWithoutConnected_accountsInputObjectSchema: z.ZodType<Prisma.metric_bindingsCreateNestedManyWithoutConnected_accountsInput, Prisma.metric_bindingsCreateNestedManyWithoutConnected_accountsInput> = z.object({
  create: z.union([z.lazy(() => metric_bindingsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => metric_bindingsCreateWithoutConnected_accountsInputObjectSchema).array(), z.lazy(() => metric_bindingsUncheckedCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => metric_bindingsUncheckedCreateWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_bindingsCreateOrConnectWithoutConnected_accountsInputObjectSchema), z.lazy(() => metric_bindingsCreateOrConnectWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_bindingsCreateManyConnected_accountsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema), z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const metric_bindingsCreateNestedManyWithoutConnected_accountsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_bindingsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => metric_bindingsCreateWithoutConnected_accountsInputObjectSchema).array(), z.lazy(() => metric_bindingsUncheckedCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => metric_bindingsUncheckedCreateWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => metric_bindingsCreateOrConnectWithoutConnected_accountsInputObjectSchema), z.lazy(() => metric_bindingsCreateOrConnectWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => metric_bindingsCreateManyConnected_accountsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema), z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
