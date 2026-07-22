// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Canvas_snapshotsSumAggregateInputObjectSchema: z.ZodType<Prisma.Canvas_snapshotsSumAggregateInputType, Prisma.Canvas_snapshotsSumAggregateInputType> = z.object({
  version: z.literal(true).optional()
}).strict();
export const Canvas_snapshotsSumAggregateInputObjectZodSchema = z.object({
  version: z.literal(true).optional()
}).strict();
