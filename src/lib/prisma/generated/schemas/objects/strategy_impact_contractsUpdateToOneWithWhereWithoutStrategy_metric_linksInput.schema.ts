// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_impact_contractsWhereInputObjectSchema } from './strategy_impact_contractsWhereInput.schema';
import { strategy_impact_contractsUpdateWithoutStrategy_metric_linksInputObjectSchema } from './strategy_impact_contractsUpdateWithoutStrategy_metric_linksInput.schema';
import { strategy_impact_contractsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema } from './strategy_impact_contractsUncheckedUpdateWithoutStrategy_metric_linksInput.schema'

export const strategy_impact_contractsUpdateToOneWithWhereWithoutStrategy_metric_linksInputObjectSchema: z.ZodType<Prisma.strategy_impact_contractsUpdateToOneWithWhereWithoutStrategy_metric_linksInput, Prisma.strategy_impact_contractsUpdateToOneWithWhereWithoutStrategy_metric_linksInput> = z.object({
  where: z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => strategy_impact_contractsUpdateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema)])
}).strict();
export const strategy_impact_contractsUpdateToOneWithWhereWithoutStrategy_metric_linksInputObjectZodSchema = z.object({
  where: z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => strategy_impact_contractsUpdateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema)])
}).strict();
