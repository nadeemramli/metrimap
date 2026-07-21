// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsCreateWithoutConnector_runsInputObjectSchema } from './connected_accountsCreateWithoutConnector_runsInput.schema';
import { connected_accountsUncheckedCreateWithoutConnector_runsInputObjectSchema } from './connected_accountsUncheckedCreateWithoutConnector_runsInput.schema';
import { connected_accountsCreateOrConnectWithoutConnector_runsInputObjectSchema } from './connected_accountsCreateOrConnectWithoutConnector_runsInput.schema';
import { connected_accountsUpsertWithoutConnector_runsInputObjectSchema } from './connected_accountsUpsertWithoutConnector_runsInput.schema';
import { connected_accountsWhereInputObjectSchema } from './connected_accountsWhereInput.schema';
import { connected_accountsWhereUniqueInputObjectSchema } from './connected_accountsWhereUniqueInput.schema';
import { connected_accountsUpdateToOneWithWhereWithoutConnector_runsInputObjectSchema } from './connected_accountsUpdateToOneWithWhereWithoutConnector_runsInput.schema';
import { connected_accountsUpdateWithoutConnector_runsInputObjectSchema } from './connected_accountsUpdateWithoutConnector_runsInput.schema';
import { connected_accountsUncheckedUpdateWithoutConnector_runsInputObjectSchema } from './connected_accountsUncheckedUpdateWithoutConnector_runsInput.schema'

export const connected_accountsUpdateOneWithoutConnector_runsNestedInputObjectSchema: z.ZodType<Prisma.connected_accountsUpdateOneWithoutConnector_runsNestedInput, Prisma.connected_accountsUpdateOneWithoutConnector_runsNestedInput> = z.object({
  create: z.union([z.lazy(() => connected_accountsCreateWithoutConnector_runsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutConnector_runsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => connected_accountsCreateOrConnectWithoutConnector_runsInputObjectSchema).optional(),
  upsert: z.lazy(() => connected_accountsUpsertWithoutConnector_runsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => connected_accountsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => connected_accountsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => connected_accountsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => connected_accountsUpdateToOneWithWhereWithoutConnector_runsInputObjectSchema), z.lazy(() => connected_accountsUpdateWithoutConnector_runsInputObjectSchema), z.lazy(() => connected_accountsUncheckedUpdateWithoutConnector_runsInputObjectSchema)]).optional()
}).strict();
export const connected_accountsUpdateOneWithoutConnector_runsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => connected_accountsCreateWithoutConnector_runsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutConnector_runsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => connected_accountsCreateOrConnectWithoutConnector_runsInputObjectSchema).optional(),
  upsert: z.lazy(() => connected_accountsUpsertWithoutConnector_runsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => connected_accountsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => connected_accountsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => connected_accountsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => connected_accountsUpdateToOneWithWhereWithoutConnector_runsInputObjectSchema), z.lazy(() => connected_accountsUpdateWithoutConnector_runsInputObjectSchema), z.lazy(() => connected_accountsUncheckedUpdateWithoutConnector_runsInputObjectSchema)]).optional()
}).strict();
