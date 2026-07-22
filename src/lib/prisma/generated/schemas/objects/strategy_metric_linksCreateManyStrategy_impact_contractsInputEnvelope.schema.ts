// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_metric_linksCreateManyStrategy_impact_contractsInputObjectSchema } from './strategy_metric_linksCreateManyStrategy_impact_contractsInput.schema'

export const strategy_metric_linksCreateManyStrategy_impact_contractsInputEnvelopeObjectSchema: z.ZodType<Prisma.strategy_metric_linksCreateManyStrategy_impact_contractsInputEnvelope, Prisma.strategy_metric_linksCreateManyStrategy_impact_contractsInputEnvelope> = z.object({
  data: z.union([z.lazy(() => strategy_metric_linksCreateManyStrategy_impact_contractsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateManyStrategy_impact_contractsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const strategy_metric_linksCreateManyStrategy_impact_contractsInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => strategy_metric_linksCreateManyStrategy_impact_contractsInputObjectSchema), z.lazy(() => strategy_metric_linksCreateManyStrategy_impact_contractsInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
