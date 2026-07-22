// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Error_report_groupsSumAggregateInputObjectSchema: z.ZodType<Prisma.Error_report_groupsSumAggregateInputType, Prisma.Error_report_groupsSumAggregateInputType> = z.object({
  occurrence_count: z.literal(true).optional(),
  last_synced_count: z.literal(true).optional()
}).strict();
export const Error_report_groupsSumAggregateInputObjectZodSchema = z.object({
  occurrence_count: z.literal(true).optional(),
  last_synced_count: z.literal(true).optional()
}).strict();
