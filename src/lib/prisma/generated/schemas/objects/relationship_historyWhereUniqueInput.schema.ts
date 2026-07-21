// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const relationship_historyWhereUniqueInputObjectSchema: z.ZodType<Prisma.relationship_historyWhereUniqueInput, Prisma.relationship_historyWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const relationship_historyWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
