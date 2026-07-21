// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Strategy_impact_contractsCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.Strategy_impact_contractsCountOutputTypeSelect, Prisma.Strategy_impact_contractsCountOutputTypeSelect> = z.object({
  strategy_metric_links: z.boolean().optional()
}).strict();
export const Strategy_impact_contractsCountOutputTypeSelectObjectZodSchema = z.object({
  strategy_metric_links: z.boolean().optional()
}).strict();
