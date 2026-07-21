// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsCreateWithoutConnector_cursorsInputObjectSchema } from './connected_accountsCreateWithoutConnector_cursorsInput.schema';
import { connected_accountsUncheckedCreateWithoutConnector_cursorsInputObjectSchema } from './connected_accountsUncheckedCreateWithoutConnector_cursorsInput.schema';
import { connected_accountsCreateOrConnectWithoutConnector_cursorsInputObjectSchema } from './connected_accountsCreateOrConnectWithoutConnector_cursorsInput.schema';
import { connected_accountsWhereUniqueInputObjectSchema } from './connected_accountsWhereUniqueInput.schema'

export const connected_accountsCreateNestedOneWithoutConnector_cursorsInputObjectSchema: z.ZodType<Prisma.connected_accountsCreateNestedOneWithoutConnector_cursorsInput, Prisma.connected_accountsCreateNestedOneWithoutConnector_cursorsInput> = z.object({
  create: z.union([z.lazy(() => connected_accountsCreateWithoutConnector_cursorsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutConnector_cursorsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => connected_accountsCreateOrConnectWithoutConnector_cursorsInputObjectSchema).optional(),
  connect: z.lazy(() => connected_accountsWhereUniqueInputObjectSchema).optional()
}).strict();
export const connected_accountsCreateNestedOneWithoutConnector_cursorsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => connected_accountsCreateWithoutConnector_cursorsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutConnector_cursorsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => connected_accountsCreateOrConnectWithoutConnector_cursorsInputObjectSchema).optional(),
  connect: z.lazy(() => connected_accountsWhereUniqueInputObjectSchema).optional()
}).strict();
