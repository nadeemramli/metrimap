// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const spacesWhereUniqueInputObjectSchema: z.ZodType<Prisma.spacesWhereUniqueInput, Prisma.spacesWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const spacesWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
