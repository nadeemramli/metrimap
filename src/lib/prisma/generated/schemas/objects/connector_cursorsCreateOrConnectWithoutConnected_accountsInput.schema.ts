// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connector_cursorsWhereUniqueInputObjectSchema } from './connector_cursorsWhereUniqueInput.schema';
import { connector_cursorsCreateWithoutConnected_accountsInputObjectSchema } from './connector_cursorsCreateWithoutConnected_accountsInput.schema';
import { connector_cursorsUncheckedCreateWithoutConnected_accountsInputObjectSchema } from './connector_cursorsUncheckedCreateWithoutConnected_accountsInput.schema'

export const connector_cursorsCreateOrConnectWithoutConnected_accountsInputObjectSchema: z.ZodType<Prisma.connector_cursorsCreateOrConnectWithoutConnected_accountsInput, Prisma.connector_cursorsCreateOrConnectWithoutConnected_accountsInput> = z.object({
  where: z.lazy(() => connector_cursorsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => connector_cursorsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsUncheckedCreateWithoutConnected_accountsInputObjectSchema)])
}).strict();
export const connector_cursorsCreateOrConnectWithoutConnected_accountsInputObjectZodSchema = z.object({
  where: z.lazy(() => connector_cursorsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => connector_cursorsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsUncheckedCreateWithoutConnected_accountsInputObjectSchema)])
}).strict();
