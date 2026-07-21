// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connector_runsScalarWhereInputObjectSchema } from './connector_runsScalarWhereInput.schema';
import { connector_runsUpdateManyMutationInputObjectSchema } from './connector_runsUpdateManyMutationInput.schema';
import { connector_runsUncheckedUpdateManyWithoutConnected_accountsInputObjectSchema } from './connector_runsUncheckedUpdateManyWithoutConnected_accountsInput.schema'

export const connector_runsUpdateManyWithWhereWithoutConnected_accountsInputObjectSchema: z.ZodType<Prisma.connector_runsUpdateManyWithWhereWithoutConnected_accountsInput, Prisma.connector_runsUpdateManyWithWhereWithoutConnected_accountsInput> = z.object({
  where: z.lazy(() => connector_runsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => connector_runsUpdateManyMutationInputObjectSchema), z.lazy(() => connector_runsUncheckedUpdateManyWithoutConnected_accountsInputObjectSchema)])
}).strict();
export const connector_runsUpdateManyWithWhereWithoutConnected_accountsInputObjectZodSchema = z.object({
  where: z.lazy(() => connector_runsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => connector_runsUpdateManyMutationInputObjectSchema), z.lazy(() => connector_runsUncheckedUpdateManyWithoutConnected_accountsInputObjectSchema)])
}).strict();
