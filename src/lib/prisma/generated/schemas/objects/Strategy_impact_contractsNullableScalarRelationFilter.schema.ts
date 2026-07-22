// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_impact_contractsWhereInputObjectSchema } from './strategy_impact_contractsWhereInput.schema'

export const Strategy_impact_contractsNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.Strategy_impact_contractsNullableScalarRelationFilter, Prisma.Strategy_impact_contractsNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).optional().nullable()
}).strict();
export const Strategy_impact_contractsNullableScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => strategy_impact_contractsWhereInputObjectSchema).optional().nullable()
}).strict();
