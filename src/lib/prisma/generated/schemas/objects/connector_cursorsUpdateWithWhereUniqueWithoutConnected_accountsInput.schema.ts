// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connector_cursorsWhereUniqueInputObjectSchema } from './connector_cursorsWhereUniqueInput.schema';
import { connector_cursorsUpdateWithoutConnected_accountsInputObjectSchema } from './connector_cursorsUpdateWithoutConnected_accountsInput.schema';
import { connector_cursorsUncheckedUpdateWithoutConnected_accountsInputObjectSchema } from './connector_cursorsUncheckedUpdateWithoutConnected_accountsInput.schema'

export const connector_cursorsUpdateWithWhereUniqueWithoutConnected_accountsInputObjectSchema: z.ZodType<Prisma.connector_cursorsUpdateWithWhereUniqueWithoutConnected_accountsInput, Prisma.connector_cursorsUpdateWithWhereUniqueWithoutConnected_accountsInput> = z.object({
  where: z.lazy(() => connector_cursorsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => connector_cursorsUpdateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsUncheckedUpdateWithoutConnected_accountsInputObjectSchema)])
}).strict();
export const connector_cursorsUpdateWithWhereUniqueWithoutConnected_accountsInputObjectZodSchema = z.object({
  where: z.lazy(() => connector_cursorsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => connector_cursorsUpdateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsUncheckedUpdateWithoutConnected_accountsInputObjectSchema)])
}).strict();
