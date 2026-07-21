// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const alert_rulesWhereUniqueInputObjectSchema: z.ZodType<Prisma.alert_rulesWhereUniqueInput, Prisma.alert_rulesWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const alert_rulesWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
