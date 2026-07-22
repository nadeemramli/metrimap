// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const connector_runsWhereUniqueInputObjectSchema: z.ZodType<Prisma.connector_runsWhereUniqueInput, Prisma.connector_runsWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const connector_runsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
