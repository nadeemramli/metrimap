// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsUpdateWithoutStrategy_impact_contractsInputObjectSchema } from './metric_cardsUpdateWithoutStrategy_impact_contractsInput.schema';
import { metric_cardsUncheckedUpdateWithoutStrategy_impact_contractsInputObjectSchema } from './metric_cardsUncheckedUpdateWithoutStrategy_impact_contractsInput.schema';
import { metric_cardsCreateWithoutStrategy_impact_contractsInputObjectSchema } from './metric_cardsCreateWithoutStrategy_impact_contractsInput.schema';
import { metric_cardsUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema } from './metric_cardsUncheckedCreateWithoutStrategy_impact_contractsInput.schema';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema'

export const metric_cardsUpsertWithoutStrategy_impact_contractsInputObjectSchema: z.ZodType<Prisma.metric_cardsUpsertWithoutStrategy_impact_contractsInput, Prisma.metric_cardsUpsertWithoutStrategy_impact_contractsInput> = z.object({
  update: z.union([z.lazy(() => metric_cardsUpdateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutStrategy_impact_contractsInputObjectSchema)]),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema)]),
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional()
}).strict();
export const metric_cardsUpsertWithoutStrategy_impact_contractsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => metric_cardsUpdateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => metric_cardsUncheckedUpdateWithoutStrategy_impact_contractsInputObjectSchema)]),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema)]),
  where: z.lazy(() => metric_cardsWhereInputObjectSchema).optional()
}).strict();
