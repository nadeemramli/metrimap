// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connector_cursorsScalarWhereInputObjectSchema } from './connector_cursorsScalarWhereInput.schema';
import { connector_cursorsUpdateManyMutationInputObjectSchema } from './connector_cursorsUpdateManyMutationInput.schema';
import { connector_cursorsUncheckedUpdateManyWithoutConnected_accountsInputObjectSchema } from './connector_cursorsUncheckedUpdateManyWithoutConnected_accountsInput.schema'

export const connector_cursorsUpdateManyWithWhereWithoutConnected_accountsInputObjectSchema: z.ZodType<Prisma.connector_cursorsUpdateManyWithWhereWithoutConnected_accountsInput, Prisma.connector_cursorsUpdateManyWithWhereWithoutConnected_accountsInput> = z.object({
  where: z.lazy(() => connector_cursorsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => connector_cursorsUpdateManyMutationInputObjectSchema), z.lazy(() => connector_cursorsUncheckedUpdateManyWithoutConnected_accountsInputObjectSchema)])
}).strict();
export const connector_cursorsUpdateManyWithWhereWithoutConnected_accountsInputObjectZodSchema = z.object({
  where: z.lazy(() => connector_cursorsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => connector_cursorsUpdateManyMutationInputObjectSchema), z.lazy(() => connector_cursorsUncheckedUpdateManyWithoutConnected_accountsInputObjectSchema)])
}).strict();
