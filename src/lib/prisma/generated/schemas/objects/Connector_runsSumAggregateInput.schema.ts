// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Connector_runsSumAggregateInputObjectSchema: z.ZodType<Prisma.Connector_runsSumAggregateInputType, Prisma.Connector_runsSumAggregateInputType> = z.object({
  pages: z.literal(true).optional(),
  fetched: z.literal(true).optional(),
  accepted: z.literal(true).optional(),
  skipped: z.literal(true).optional(),
  rejected: z.literal(true).optional(),
  materialized: z.literal(true).optional(),
  duration_ms: z.literal(true).optional()
}).strict();
export const Connector_runsSumAggregateInputObjectZodSchema = z.object({
  pages: z.literal(true).optional(),
  fetched: z.literal(true).optional(),
  accepted: z.literal(true).optional(),
  skipped: z.literal(true).optional(),
  rejected: z.literal(true).optional(),
  materialized: z.literal(true).optional(),
  duration_ms: z.literal(true).optional()
}).strict();
