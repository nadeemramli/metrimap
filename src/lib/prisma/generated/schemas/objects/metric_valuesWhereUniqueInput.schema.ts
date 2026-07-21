// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_valuesTracked_metric_idPeriodCompoundUniqueInputObjectSchema } from './metric_valuesTracked_metric_idPeriodCompoundUniqueInput.schema'

export const metric_valuesWhereUniqueInputObjectSchema: z.ZodType<Prisma.metric_valuesWhereUniqueInput, Prisma.metric_valuesWhereUniqueInput> = z.object({
  id: z.string(),
  tracked_metric_id_period: z.lazy(() => metric_valuesTracked_metric_idPeriodCompoundUniqueInputObjectSchema)
}).strict();
export const metric_valuesWhereUniqueInputObjectZodSchema = z.object({
  id: z.string(),
  tracked_metric_id_period: z.lazy(() => metric_valuesTracked_metric_idPeriodCompoundUniqueInputObjectSchema)
}).strict();
