// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { Strategy_impact_contractsCountOutputTypeSelectObjectSchema } from './Strategy_impact_contractsCountOutputTypeSelect.schema'

export const Strategy_impact_contractsCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => Strategy_impact_contractsCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const Strategy_impact_contractsCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => Strategy_impact_contractsCountOutputTypeSelectObjectSchema).optional()
}).strict();
