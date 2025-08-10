import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const commentsWhereUniqueInputObjectSchema: z.ZodType<Prisma.commentsWhereUniqueInput, Prisma.commentsWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const commentsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
