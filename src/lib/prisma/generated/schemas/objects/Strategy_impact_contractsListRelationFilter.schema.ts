// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_impact_contractsWhereInputObjectSchema } from './strategy_impact_contractsWhereInput.schema'

export const Strategy_impact_contractsListRelationFilterObjectSchema: z.ZodType<Prisma.Strategy_impact_contractsListRelationFilter, Prisma.Strategy_impact_contractsListRelationFilter> = z.object({
  every: z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).optional(),
  some: z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).optional(),
  none: z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).optional()
}).strict();
export const Strategy_impact_contractsListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).optional(),
  some: z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).optional(),
  none: z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).optional()
}).strict();
