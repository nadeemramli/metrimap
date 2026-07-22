// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connector_runsWhereUniqueInputObjectSchema } from './connector_runsWhereUniqueInput.schema';
import { connector_runsUpdateWithoutConnected_accountsInputObjectSchema } from './connector_runsUpdateWithoutConnected_accountsInput.schema';
import { connector_runsUncheckedUpdateWithoutConnected_accountsInputObjectSchema } from './connector_runsUncheckedUpdateWithoutConnected_accountsInput.schema'

export const connector_runsUpdateWithWhereUniqueWithoutConnected_accountsInputObjectSchema: z.ZodType<Prisma.connector_runsUpdateWithWhereUniqueWithoutConnected_accountsInput, Prisma.connector_runsUpdateWithWhereUniqueWithoutConnected_accountsInput> = z.object({
  where: z.lazy(() => connector_runsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => connector_runsUpdateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_runsUncheckedUpdateWithoutConnected_accountsInputObjectSchema)])
}).strict();
export const connector_runsUpdateWithWhereUniqueWithoutConnected_accountsInputObjectZodSchema = z.object({
  where: z.lazy(() => connector_runsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => connector_runsUpdateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_runsUncheckedUpdateWithoutConnected_accountsInputObjectSchema)])
}).strict();
