// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const strategy_metric_linksWhereUniqueInputObjectSchema: z.ZodType<Prisma.strategy_metric_linksWhereUniqueInput, Prisma.strategy_metric_linksWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const strategy_metric_linksWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
