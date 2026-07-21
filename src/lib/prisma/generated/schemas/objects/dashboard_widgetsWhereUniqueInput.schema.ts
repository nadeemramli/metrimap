// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const dashboard_widgetsWhereUniqueInputObjectSchema: z.ZodType<Prisma.dashboard_widgetsWhereUniqueInput, Prisma.dashboard_widgetsWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const dashboard_widgetsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
