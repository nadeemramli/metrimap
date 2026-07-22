// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_bindingsScalarWhereInputObjectSchema } from './metric_bindingsScalarWhereInput.schema';
import { metric_bindingsUpdateManyMutationInputObjectSchema } from './metric_bindingsUpdateManyMutationInput.schema';
import { metric_bindingsUncheckedUpdateManyWithoutConnected_accountsInputObjectSchema } from './metric_bindingsUncheckedUpdateManyWithoutConnected_accountsInput.schema'

export const metric_bindingsUpdateManyWithWhereWithoutConnected_accountsInputObjectSchema: z.ZodType<Prisma.metric_bindingsUpdateManyWithWhereWithoutConnected_accountsInput, Prisma.metric_bindingsUpdateManyWithWhereWithoutConnected_accountsInput> = z.object({
  where: z.lazy(() => metric_bindingsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => metric_bindingsUpdateManyMutationInputObjectSchema), z.lazy(() => metric_bindingsUncheckedUpdateManyWithoutConnected_accountsInputObjectSchema)])
}).strict();
export const metric_bindingsUpdateManyWithWhereWithoutConnected_accountsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_bindingsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => metric_bindingsUpdateManyMutationInputObjectSchema), z.lazy(() => metric_bindingsUncheckedUpdateManyWithoutConnected_accountsInputObjectSchema)])
}).strict();
