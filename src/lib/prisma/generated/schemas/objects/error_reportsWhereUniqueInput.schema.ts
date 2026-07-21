// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const error_reportsWhereUniqueInputObjectSchema: z.ZodType<Prisma.error_reportsWhereUniqueInput, Prisma.error_reportsWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const error_reportsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
