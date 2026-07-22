// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_cardsCreateWithoutStrategy_impact_contractsInputObjectSchema } from './metric_cardsCreateWithoutStrategy_impact_contractsInput.schema';
import { metric_cardsUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema } from './metric_cardsUncheckedCreateWithoutStrategy_impact_contractsInput.schema';
import { metric_cardsCreateOrConnectWithoutStrategy_impact_contractsInputObjectSchema } from './metric_cardsCreateOrConnectWithoutStrategy_impact_contractsInput.schema';
import { metric_cardsWhereUniqueInputObjectSchema } from './metric_cardsWhereUniqueInput.schema'

export const metric_cardsCreateNestedOneWithoutStrategy_impact_contractsInputObjectSchema: z.ZodType<Prisma.metric_cardsCreateNestedOneWithoutStrategy_impact_contractsInput, Prisma.metric_cardsCreateNestedOneWithoutStrategy_impact_contractsInput> = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutStrategy_impact_contractsInputObjectSchema).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional()
}).strict();
export const metric_cardsCreateNestedOneWithoutStrategy_impact_contractsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => metric_cardsCreateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => metric_cardsUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => metric_cardsCreateOrConnectWithoutStrategy_impact_contractsInputObjectSchema).optional(),
  connect: z.lazy(() => metric_cardsWhereUniqueInputObjectSchema).optional()
}).strict();
