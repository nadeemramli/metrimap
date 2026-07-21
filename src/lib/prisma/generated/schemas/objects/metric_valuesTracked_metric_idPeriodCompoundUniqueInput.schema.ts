// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const metric_valuesTracked_metric_idPeriodCompoundUniqueInputObjectSchema: z.ZodType<Prisma.metric_valuesTracked_metric_idPeriodCompoundUniqueInput, Prisma.metric_valuesTracked_metric_idPeriodCompoundUniqueInput> = z.object({
  tracked_metric_id: z.string(),
  period: z.string()
}).strict();
export const metric_valuesTracked_metric_idPeriodCompoundUniqueInputObjectZodSchema = z.object({
  tracked_metric_id: z.string(),
  period: z.string()
}).strict();
