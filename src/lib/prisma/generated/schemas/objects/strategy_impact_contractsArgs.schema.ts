// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { strategy_impact_contractsSelectObjectSchema } from './strategy_impact_contractsSelect.schema';
import { strategy_impact_contractsIncludeObjectSchema } from './strategy_impact_contractsInclude.schema'

export const strategy_impact_contractsArgsObjectSchema = z.object({
  select: z.lazy(() => strategy_impact_contractsSelectObjectSchema).optional(),
  include: z.lazy(() => strategy_impact_contractsIncludeObjectSchema).optional()
}).strict();
export const strategy_impact_contractsArgsObjectZodSchema = z.object({
  select: z.lazy(() => strategy_impact_contractsSelectObjectSchema).optional(),
  include: z.lazy(() => strategy_impact_contractsIncludeObjectSchema).optional()
}).strict();
