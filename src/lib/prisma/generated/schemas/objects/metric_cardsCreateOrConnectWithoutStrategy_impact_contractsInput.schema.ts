// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema';
import { metric_cardsCreateWithoutStrategy_impact_contractsInputObjectSchema } from './metric_cardsCreateWithoutStrategy_impact_contractsInput.schema';
import { metric_cardsUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema } from './metric_cardsUncheckedCreateWithoutStrategy_impact_contractsInput.schema'

export const metric_cardsCreateOrConnectWithoutStrategy_impact_contractsInputObjectSchema: z.ZodType<Prisma.metric_cardsCreateOrConnectWithoutStrategy_impact_contractsInput, Prisma.metric_cardsCreateOrConnectWithoutStrategy_impact_contractsInput> = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema)])
}).strict();
export const metric_cardsCreateOrConnectWithoutStrategy_impact_contractsInputObjectZodSchema = z.object({
  where: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => metric_cardsCreateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema)])
}).strict();
