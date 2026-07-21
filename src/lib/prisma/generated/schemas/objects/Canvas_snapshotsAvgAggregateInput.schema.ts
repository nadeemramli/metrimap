// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Canvas_snapshotsAvgAggregateInputObjectSchema: z.ZodType<Prisma.Canvas_snapshotsAvgAggregateInputType, Prisma.Canvas_snapshotsAvgAggregateInputType> = z.object({
  version: z.literal(true).optional()
}).strict();
export const Canvas_snapshotsAvgAggregateInputObjectZodSchema = z.object({
  version: z.literal(true).optional()
}).strict();
