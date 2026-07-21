// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsCreateWithoutMetric_bindingsInputObjectSchema } from './connected_accountsCreateWithoutMetric_bindingsInput.schema';
import { connected_accountsUncheckedCreateWithoutMetric_bindingsInputObjectSchema } from './connected_accountsUncheckedCreateWithoutMetric_bindingsInput.schema';
import { connected_accountsCreateOrConnectWithoutMetric_bindingsInputObjectSchema } from './connected_accountsCreateOrConnectWithoutMetric_bindingsInput.schema';
import { connected_accountsUpsertWithoutMetric_bindingsInputObjectSchema } from './connected_accountsUpsertWithoutMetric_bindingsInput.schema';
import { connected_accountsWhereUniqueInputObjectSchema } from './connected_accountsWhereUniqueInput.schema';
import { connected_accountsUpdateToOneWithWhereWithoutMetric_bindingsInputObjectSchema } from './connected_accountsUpdateToOneWithWhereWithoutMetric_bindingsInput.schema';
import { connected_accountsUpdateWithoutMetric_bindingsInputObjectSchema } from './connected_accountsUpdateWithoutMetric_bindingsInput.schema';
import { connected_accountsUncheckedUpdateWithoutMetric_bindingsInputObjectSchema } from './connected_accountsUncheckedUpdateWithoutMetric_bindingsInput.schema'

export const connected_accountsUpdateOneRequiredWithoutMetric_bindingsNestedInputObjectSchema: z.ZodType<Prisma.connected_accountsUpdateOneRequiredWithoutMetric_bindingsNestedInput, Prisma.connected_accountsUpdateOneRequiredWithoutMetric_bindingsNestedInput> = z.object({
  create: z.union([z.lazy(() => connected_accountsCreateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutMetric_bindingsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => connected_accountsCreateOrConnectWithoutMetric_bindingsInputObjectSchema).optional(),
  upsert: z.lazy(() => connected_accountsUpsertWithoutMetric_bindingsInputObjectSchema).optional(),
  connect: z.lazy(() => connected_accountsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => connected_accountsUpdateToOneWithWhereWithoutMetric_bindingsInputObjectSchema), z.lazy(() => connected_accountsUpdateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => connected_accountsUncheckedUpdateWithoutMetric_bindingsInputObjectSchema)]).optional()
}).strict();
export const connected_accountsUpdateOneRequiredWithoutMetric_bindingsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => connected_accountsCreateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => connected_accountsUncheckedCreateWithoutMetric_bindingsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => connected_accountsCreateOrConnectWithoutMetric_bindingsInputObjectSchema).optional(),
  upsert: z.lazy(() => connected_accountsUpsertWithoutMetric_bindingsInputObjectSchema).optional(),
  connect: z.lazy(() => connected_accountsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => connected_accountsUpdateToOneWithWhereWithoutMetric_bindingsInputObjectSchema), z.lazy(() => connected_accountsUpdateWithoutMetric_bindingsInputObjectSchema), z.lazy(() => connected_accountsUncheckedUpdateWithoutMetric_bindingsInputObjectSchema)]).optional()
}).strict();
