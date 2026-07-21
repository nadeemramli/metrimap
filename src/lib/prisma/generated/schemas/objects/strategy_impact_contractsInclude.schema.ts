// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsArgsObjectSchema } from './projectsArgs.schema';
import { metric_cardsArgsObjectSchema } from './metric_cardsArgs.schema';
import { Strategy_metric_linksFindManySchema } from '../findManystrategy_metric_links.schema';
import { strategy_impact_contractsCountOutputTypeArgsObjectSchema } from './strategy_impact_contractsCountOutputTypeArgs.schema'

export const strategy_impact_contractsIncludeObjectSchema: z.ZodType<Prisma.strategy_impact_contractsInclude, Prisma.strategy_impact_contractsInclude> = z.object({
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  metric_cards: z.union([z.boolean(), z.lazy(() => metric_cardsArgsObjectSchema)]).optional(),
  strategy_metric_links: z.union([z.boolean(), z.lazy(() => Strategy_metric_linksFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => strategy_impact_contractsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const strategy_impact_contractsIncludeObjectZodSchema = z.object({
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  metric_cards: z.union([z.boolean(), z.lazy(() => metric_cardsArgsObjectSchema)]).optional(),
  strategy_metric_links: z.union([z.boolean(), z.lazy(() => Strategy_metric_linksFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => strategy_impact_contractsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
