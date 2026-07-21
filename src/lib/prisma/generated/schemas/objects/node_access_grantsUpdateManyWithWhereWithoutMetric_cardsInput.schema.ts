// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { node_access_grantsScalarWhereInputObjectSchema } from './node_access_grantsScalarWhereInput.schema';
import { node_access_grantsUpdateManyMutationInputObjectSchema } from './node_access_grantsUpdateManyMutationInput.schema';
import { node_access_grantsUncheckedUpdateManyWithoutMetric_cardsInputObjectSchema } from './node_access_grantsUncheckedUpdateManyWithoutMetric_cardsInput.schema'

export const node_access_grantsUpdateManyWithWhereWithoutMetric_cardsInputObjectSchema: z.ZodType<Prisma.node_access_grantsUpdateManyWithWhereWithoutMetric_cardsInput, Prisma.node_access_grantsUpdateManyWithWhereWithoutMetric_cardsInput> = z.object({
  where: z.lazy(() => node_access_grantsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => node_access_grantsUpdateManyMutationInputObjectSchema), z.lazy(() => node_access_grantsUncheckedUpdateManyWithoutMetric_cardsInputObjectSchema)])
}).strict();
export const node_access_grantsUpdateManyWithWhereWithoutMetric_cardsInputObjectZodSchema = z.object({
  where: z.lazy(() => node_access_grantsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => node_access_grantsUpdateManyMutationInputObjectSchema), z.lazy(() => node_access_grantsUncheckedUpdateManyWithoutMetric_cardsInputObjectSchema)])
}).strict();
