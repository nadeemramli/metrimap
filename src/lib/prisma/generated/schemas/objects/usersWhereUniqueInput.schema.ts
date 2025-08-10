import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const usersWhereUniqueInputObjectSchema: z.ZodType<Prisma.usersWhereUniqueInput, Prisma.usersWhereUniqueInput> = z.object({
  id: z.string(),
  email: z.string()
}).strict();
export const usersWhereUniqueInputObjectZodSchema = z.object({
  id: z.string(),
  email: z.string()
}).strict();
