import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const tagsWhereUniqueInputObjectSchema: z.ZodType<Prisma.tagsWhereUniqueInput, Prisma.tagsWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const tagsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
