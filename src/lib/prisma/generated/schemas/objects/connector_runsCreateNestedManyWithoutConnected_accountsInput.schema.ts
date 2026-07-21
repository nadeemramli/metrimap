// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connector_runsCreateWithoutConnected_accountsInputObjectSchema } from './connector_runsCreateWithoutConnected_accountsInput.schema';
import { connector_runsUncheckedCreateWithoutConnected_accountsInputObjectSchema } from './connector_runsUncheckedCreateWithoutConnected_accountsInput.schema';
import { connector_runsCreateOrConnectWithoutConnected_accountsInputObjectSchema } from './connector_runsCreateOrConnectWithoutConnected_accountsInput.schema';
import { connector_runsCreateManyConnected_accountsInputEnvelopeObjectSchema } from './connector_runsCreateManyConnected_accountsInputEnvelope.schema';
import { connector_runsWhereUniqueInputObjectSchema } from './connector_runsWhereUniqueInput.schema'

export const connector_runsCreateNestedManyWithoutConnected_accountsInputObjectSchema: z.ZodType<Prisma.connector_runsCreateNestedManyWithoutConnected_accountsInput, Prisma.connector_runsCreateNestedManyWithoutConnected_accountsInput> = z.object({
  create: z.union([z.lazy(() => connector_runsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_runsCreateWithoutConnected_accountsInputObjectSchema).array(), z.lazy(() => connector_runsUncheckedCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_runsUncheckedCreateWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => connector_runsCreateOrConnectWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_runsCreateOrConnectWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => connector_runsCreateManyConnected_accountsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => connector_runsWhereUniqueInputObjectSchema), z.lazy(() => connector_runsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const connector_runsCreateNestedManyWithoutConnected_accountsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => connector_runsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_runsCreateWithoutConnected_accountsInputObjectSchema).array(), z.lazy(() => connector_runsUncheckedCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_runsUncheckedCreateWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => connector_runsCreateOrConnectWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_runsCreateOrConnectWithoutConnected_accountsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => connector_runsCreateManyConnected_accountsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => connector_runsWhereUniqueInputObjectSchema), z.lazy(() => connector_runsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
