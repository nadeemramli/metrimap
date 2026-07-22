// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connector_cursorsWhereUniqueInputObjectSchema } from './connector_cursorsWhereUniqueInput.schema';
import { connector_cursorsUpdateWithoutConnected_accountsInputObjectSchema } from './connector_cursorsUpdateWithoutConnected_accountsInput.schema';
import { connector_cursorsUncheckedUpdateWithoutConnected_accountsInputObjectSchema } from './connector_cursorsUncheckedUpdateWithoutConnected_accountsInput.schema';
import { connector_cursorsCreateWithoutConnected_accountsInputObjectSchema } from './connector_cursorsCreateWithoutConnected_accountsInput.schema';
import { connector_cursorsUncheckedCreateWithoutConnected_accountsInputObjectSchema } from './connector_cursorsUncheckedCreateWithoutConnected_accountsInput.schema'

export const connector_cursorsUpsertWithWhereUniqueWithoutConnected_accountsInputObjectSchema: z.ZodType<Prisma.connector_cursorsUpsertWithWhereUniqueWithoutConnected_accountsInput, Prisma.connector_cursorsUpsertWithWhereUniqueWithoutConnected_accountsInput> = z.object({
  where: z.lazy(() => connector_cursorsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => connector_cursorsUpdateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsUncheckedUpdateWithoutConnected_accountsInputObjectSchema)]),
  create: z.union([z.lazy(() => connector_cursorsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsUncheckedCreateWithoutConnected_accountsInputObjectSchema)])
}).strict();
export const connector_cursorsUpsertWithWhereUniqueWithoutConnected_accountsInputObjectZodSchema = z.object({
  where: z.lazy(() => connector_cursorsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => connector_cursorsUpdateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsUncheckedUpdateWithoutConnected_accountsInputObjectSchema)]),
  create: z.union([z.lazy(() => connector_cursorsCreateWithoutConnected_accountsInputObjectSchema), z.lazy(() => connector_cursorsUncheckedCreateWithoutConnected_accountsInputObjectSchema)])
}).strict();
