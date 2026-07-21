// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const source_connectionsWhereUniqueInputObjectSchema: z.ZodType<Prisma.source_connectionsWhereUniqueInput, Prisma.source_connectionsWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const source_connectionsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
