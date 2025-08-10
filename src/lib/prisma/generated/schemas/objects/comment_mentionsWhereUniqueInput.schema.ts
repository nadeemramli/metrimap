import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const comment_mentionsWhereUniqueInputObjectSchema: z.ZodType<Prisma.comment_mentionsWhereUniqueInput, Prisma.comment_mentionsWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const comment_mentionsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
