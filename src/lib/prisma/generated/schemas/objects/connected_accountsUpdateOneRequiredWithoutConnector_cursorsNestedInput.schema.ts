// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsCreateWithoutConnector_cursorsInputObjectSchema } from './connected_accountsCreateWithoutConnector_cursorsInput.schema';
import { connected_accountsUncheckedCreateWithoutConnector_cursorsInputObjectSchema } from './connected_accountsUncheckedCreateWithoutConnector_cursorsInput.schema';
import { connected_accountsCreateOrConnectWithoutConnector_cursorsInputObjectSchema } from './connected_accountsCreateOrConnectWithoutConnector_cursorsInput.schema';
import { connected_accountsUpsertWithoutConnector_cursorsInputObjectSchema } from './connected_accountsUpsertWithoutConnector_cursorsInput.schema';
import { connected_accountsWhereUniqueInputObjectSchema } from './connected_accountsWhereUniqueInput.schema';
import { connected_accountsUpdateToOneWithWhereWithoutConnector_cursorsInputObjectSchema } from './connected_accountsUpdateToOneWithWhereWithoutConnector_cursorsInput.schema';
import { connected_accountsUpdateWithoutConnector_cursorsInputObjectSchema } from './connected_accountsUpdateWithoutConnector_cursorsInput.schema';
import { connected_accountsUncheckedUpdateWithoutConnector_cursorsInputObjectSchema } from './connected_accountsUncheckedUpdateWithoutConnector_cursorsInput.schema'

export const connected_accountsUpdateOneRequiredWithoutConnector_cursorsNestedInputObjectSchema: z.ZodType<Prisma.connected_accountsUpdateOneRequiredWithoutConnector_cursorsNestedInput, Prisma.connected_accountsUpdateOneRequiredWithoutConnector_cursorsNestedInput> = z.object({
  create: z.union([z.lazy(() => connected_accountsCreateWithoutConnector_cursorsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutConnector_cursorsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => connected_accountsCreateOrConnectWithoutConnector_cursorsInputObjectSchema).optional(),
  upsert: z.lazy(() => connected_accountsUpsertWithoutConnector_cursorsInputObjectSchema).optional(),
  connect: z.lazy(() => connected_accountsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => connected_accountsUpdateToOneWithWhereWithoutConnector_cursorsInputObjectSchema), z.lazy(() => connected_accountsUpdateWithoutConnector_cursorsInputObjectSchema), z.lazy(() => connected_accountsUncheckedUpdateWithoutConnector_cursorsInputObjectSchema)]).optional()
}).strict();
export const connected_accountsUpdateOneRequiredWithoutConnector_cursorsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => connected_accountsCreateWithoutConnector_cursorsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutConnector_cursorsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => connected_accountsCreateOrConnectWithoutConnector_cursorsInputObjectSchema).optional(),
  upsert: z.lazy(() => connected_accountsUpsertWithoutConnector_cursorsInputObjectSchema).optional(),
  connect: z.lazy(() => connected_accountsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => connected_accountsUpdateToOneWithWhereWithoutConnector_cursorsInputObjectSchema), z.lazy(() => connected_accountsUpdateWithoutConnector_cursorsInputObjectSchema), z.lazy(() => connected_accountsUncheckedUpdateWithoutConnector_cursorsInputObjectSchema)]).optional()
}).strict();
