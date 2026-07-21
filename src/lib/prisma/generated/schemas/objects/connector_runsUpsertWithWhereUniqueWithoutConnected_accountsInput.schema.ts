// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connector_runsWhereUniqueInputObjectSchema } from './connector_runsWhereUniqueInput.schema';
import { connector_runsUpdateWithoutConnected_accountsInputObjectSchema } from './connector_runsUpdateWithoutConnected_accountsInput.schema';
import { connector_runsUncheckedUpdateWithoutConnected_accountsInputObjectSchema } from './connector_runsUncheckedUpdateWithoutConnected_accountsInput.schema';
import { connector_runsCreateWithoutConnected_accountsInputObjectSchema } from './connector_runsCreateWithoutConnected_accountsInput.schema';
import { connector_runsUncheckedCreateWithoutConnected_accountsInputObjectSchema } from './connector_runsUncheckedCreateWithoutConnected_accountsInput.schema'

export const connector_runsUpsertWithWhereUniqueWithoutConnected_accountsInputObjectSchema: z.ZodType<Prisma.connector_runsUpsertWithWhereUniqueWithoutConnected_accountsInput, Prisma.connector_runsUpsertWithWhereUniqueWithoutConnected_accountsInput> = z.object({
  where: z.lazy(() => connector_runsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => connector_runsUpdateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_runsUncheckedUpdateWithoutConnected_accountsInputObjectSchema)]),
  create: z.union([z.lazy(() => connector_runsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_runsUncheckedCreateWithoutConnected_accountsInputObjectSchema)])
}).strict();
export const connector_runsUpsertWithWhereUniqueWithoutConnected_accountsInputObjectZodSchema = z.object({
  where: z.lazy(() => connector_runsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => connector_runsUpdateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_runsUncheckedUpdateWithoutConnected_accountsInputObjectSchema)]),
  create: z.union([z.lazy(() => connector_runsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_runsUncheckedCreateWithoutConnected_accountsInputObjectSchema)])
}).strict();
