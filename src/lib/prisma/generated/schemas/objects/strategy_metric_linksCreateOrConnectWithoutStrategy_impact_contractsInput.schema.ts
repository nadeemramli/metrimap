// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_metric_linksWhereUniqueInputObjectSchema } from './strategy_metric_linksWhereUniqueInput.schema';
import { strategy_metric_linksCreateWithoutStrategy_impact_contractsInputObjectSchema } from './strategy_metric_linksCreateWithoutStrategy_impact_contractsInput.schema';
import { strategy_metric_linksUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema } from './strategy_metric_linksUncheckedCreateWithoutStrategy_impact_contractsInput.schema'

export const strategy_metric_linksCreateOrConnectWithoutStrategy_impact_contractsInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksCreateOrConnectWithoutStrategy_impact_contractsInput, Prisma.strategy_metric_linksCreateOrConnectWithoutStrategy_impact_contractsInput> = z.object({
  where: z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => strategy_metric_linksCreateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema)])
}).strict();
export const strategy_metric_linksCreateOrConnectWithoutStrategy_impact_contractsInputObjectZodSchema = z.object({
  where: z.lazy(() => strategy_metric_linksWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => strategy_metric_linksCreateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => strategy_metric_linksUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema)])
}).strict();
