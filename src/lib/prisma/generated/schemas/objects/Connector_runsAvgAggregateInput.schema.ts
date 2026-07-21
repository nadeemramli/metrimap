// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Connector_runsAvgAggregateInputObjectSchema: z.ZodType<Prisma.Connector_runsAvgAggregateInputType, Prisma.Connector_runsAvgAggregateInputType> = z.object({
  pages: z.literal(true).optional(),
  fetched: z.literal(true).optional(),
  accepted: z.literal(true).optional(),
  skipped: z.literal(true).optional(),
  rejected: z.literal(true).optional(),
  materialized: z.literal(true).optional(),
  duration_ms: z.literal(true).optional()
}).strict();
export const Connector_runsAvgAggregateInputObjectZodSchema = z.object({
  pages: z.literal(true).optional(),
  fetched: z.literal(true).optional(),
  accepted: z.literal(true).optional(),
  skipped: z.literal(true).optional(),
  rejected: z.literal(true).optional(),
  materialized: z.literal(true).optional(),
  duration_ms: z.literal(true).optional()
}).strict();
