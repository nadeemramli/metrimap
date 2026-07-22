// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_bindingsWhereUniqueInputObjectSchema } from './metric_bindingsWhereUniqueInput.schema';
import { metric_bindingsUpdateWithoutConnected_accountsInputObjectSchema } from './metric_bindingsUpdateWithoutConnected_accountsInput.schema';
import { metric_bindingsUncheckedUpdateWithoutConnected_accountsInputObjectSchema } from './metric_bindingsUncheckedUpdateWithoutConnected_accountsInput.schema'

export const metric_bindingsUpdateWithWhereUniqueWithoutConnected_accountsInputObjectSchema: z.ZodType<Prisma.metric_bindingsUpdateWithWhereUniqueWithoutConnected_accountsInput, Prisma.metric_bindingsUpdateWithWhereUniqueWithoutConnected_accountsInput> = z.object({
  where: z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => metric_bindingsUpdateWithoutConnected_accountsInputObjectSchema), z.lazy(() => metric_bindingsUncheckedUpdateWithoutConnected_accountsInputObjectSchema)])
}).strict();
export const metric_bindingsUpdateWithWhereUniqueWithoutConnected_accountsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_bindingsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => metric_bindingsUpdateWithoutConnected_accountsInputObjectSchema), z.lazy(() => metric_bindingsUncheckedUpdateWithoutConnected_accountsInputObjectSchema)])
}).strict();
