// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Error_report_groupsAvgAggregateInputObjectSchema: z.ZodType<Prisma.Error_report_groupsAvgAggregateInputType, Prisma.Error_report_groupsAvgAggregateInputType> = z.object({
  occurrence_count: z.literal(true).optional(),
  last_synced_count: z.literal(true).optional()
}).strict();
export const Error_report_groupsAvgAggregateInputObjectZodSchema = z.object({
  occurrence_count: z.literal(true).optional(),
  last_synced_count: z.literal(true).optional()
}).strict();
