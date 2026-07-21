// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const strategy_impact_contractsWhereUniqueInputObjectSchema: z.ZodType<Prisma.strategy_impact_contractsWhereUniqueInput, Prisma.strategy_impact_contractsWhereUniqueInput> = z.object({
  id: z.string(),
  strategy_node_id: z.string()
}).strict();
export const strategy_impact_contractsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string(),
  strategy_node_id: z.string()
}).strict();
