// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const canvas_nodesWhereUniqueInputObjectSchema: z.ZodType<Prisma.canvas_nodesWhereUniqueInput, Prisma.canvas_nodesWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const canvas_nodesWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
