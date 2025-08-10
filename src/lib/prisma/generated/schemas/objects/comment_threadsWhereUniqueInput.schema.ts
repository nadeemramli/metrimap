import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const comment_threadsWhereUniqueInputObjectSchema: z.ZodType<Prisma.comment_threadsWhereUniqueInput, Prisma.comment_threadsWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const comment_threadsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
