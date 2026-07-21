// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const tracked_metricsWhereUniqueInputObjectSchema: z.ZodType<Prisma.tracked_metricsWhereUniqueInput, Prisma.tracked_metricsWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const tracked_metricsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
