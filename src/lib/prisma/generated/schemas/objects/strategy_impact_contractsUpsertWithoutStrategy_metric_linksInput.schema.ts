// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_impact_contractsUpdateWithoutStrategy_metric_linksInputObjectSchema } from './strategy_impact_contractsUpdateWithoutStrategy_metric_linksInput.schema';
import { strategy_impact_contractsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema } from './strategy_impact_contractsUncheckedUpdateWithoutStrategy_metric_linksInput.schema';
import { strategy_impact_contractsCreateWithoutStrategy_metric_linksInputObjectSchema } from './strategy_impact_contractsCreateWithoutStrategy_metric_linksInput.schema';
import { strategy_impact_contractsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema } from './strategy_impact_contractsUncheckedCreateWithoutStrategy_metric_linksInput.schema';
import { strategy_impact_contractsWhereInputObjectSchema } from './strategy_impact_contractsWhereInput.schema'

export const strategy_impact_contractsUpsertWithoutStrategy_metric_linksInputObjectSchema: z.ZodType<Prisma.strategy_impact_contractsUpsertWithoutStrategy_metric_linksInput, Prisma.strategy_impact_contractsUpsertWithoutStrategy_metric_linksInput> = z.object({
  update: z.union([z.lazy(() => strategy_impact_contractsUpdateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema)]),
  create: z.union([z.lazy(() => strategy_impact_contractsCreateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema)]),
  where: z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).optional()
}).strict();
export const strategy_impact_contractsUpsertWithoutStrategy_metric_linksInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => strategy_impact_contractsUpdateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedUpdateWithoutStrategy_metric_linksInputObjectSchema)]),
  create: z.union([z.lazy(() => strategy_impact_contractsCreateWithoutStrategy_metric_linksInputObjectSchema), z.lazy(() => strategy_impact_contractsUncheckedCreateWithoutStrategy_metric_linksInputObjectSchema)]),
  where: z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).optional()
}).strict();
