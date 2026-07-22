// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connector_cursorsCreateWithoutConnected_accountsInputObjectSchema } from './connector_cursorsCreateWithoutConnected_accountsInput.schema';
import { connector_cursorsUncheckedCreateWithoutConnected_accountsInputObjectSchema } from './connector_cursorsUncheckedCreateWithoutConnected_accountsInput.schema';
import { connector_cursorsCreateOrConnectWithoutConnected_accountsInputObjectSchema } from './connector_cursorsCreateOrConnectWithoutConnected_accountsInput.schema';
import { connector_cursorsCreateManyConnected_accountsInputEnvelopeObjectSchema } from './connector_cursorsCreateManyConnected_accountsInputEnvelope.schema';
import { connector_cursorsWhereUniqueInputObjectSchema } from './connector_cursorsWhereUniqueInput.schema'

export const connector_cursorsCreateNestedManyWithoutConnected_accountsInputObjectSchema: z.ZodType<Prisma.connector_cursorsCreateNestedManyWithoutConnected_accountsInput, Prisma.connector_cursorsCreateNestedManyWithoutConnected_accountsInput> = z.object({
  create: z.union([z.lazy(() => connector_cursorsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsCreateWithoutConnected_accountsInputObjectSchema).array(), z.lazy(() => connector_cursorsUncheckedCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsUncheckedCreateWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => connector_cursorsCreateOrConnectWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsCreateOrConnectWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => connector_cursorsCreateManyConnected_accountsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => connector_cursorsWhereUniqueInputObjectSchema), z.lazy(() => connector_cursorsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const connector_cursorsCreateNestedManyWithoutConnected_accountsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => connector_cursorsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsCreateWithoutConnected_accountsInputObjectSchema).array(), z.lazy(() => connector_cursorsUncheckedCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsUncheckedCreateWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => connector_cursorsCreateOrConnectWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsCreateOrConnectWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => connector_cursorsCreateManyConnected_accountsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => connector_cursorsWhereUniqueInputObjectSchema), z.lazy(() => connector_cursorsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
