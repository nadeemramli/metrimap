// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_impact_contractsWhereInputObjectSchema } from './strategy_impact_contractsWhereInput.schema'

export const Strategy_impact_contractsScalarRelationFilterObjectSchema: z.ZodType<Prisma.Strategy_impact_contractsScalarRelationFilter, Prisma.Strategy_impact_contractsScalarRelationFilter> = z.object({
  is: z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).optional()
}).strict();
export const Strategy_impact_contractsScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).optional()
}).strict();
