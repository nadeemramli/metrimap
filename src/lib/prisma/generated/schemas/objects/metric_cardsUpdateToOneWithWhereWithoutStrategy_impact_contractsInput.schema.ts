// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema';
import { metric_cardsUpdateWithoutStrategy_impact_contractsInputObjectSchema } from './metric_cardsUpdateWithoutStrategy_impact_contractsInput.schema';
import { metric_cardsUncheckedUpdateWithoutStrategy_impact_contractsInputObjectSchema } from './metric_cardsUncheckedUpdateWithoutStrategy_impact_contractsInput.schema'

export const metric_cardsUpdateToOneWithWhereWithoutStrategy_impact_contractsInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdateToOneWithWhereWithoutStrategy_impact_contractsInput, Prisma.metric_cardsUpdateToOneWithWhereWithoutStrategy_impact_contractsInput> = z.object({
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => metric_cardsUpdateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutStrategy_impact_contractsInputObjectSchema)])
}).strict();
export const metric_cardsUpdateToOneWithWhereWithoutStrategy_impact_contractsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => metric_cardsUpdateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutStrategy_impact_contractsInputObjectSchema)])
}).strict();
