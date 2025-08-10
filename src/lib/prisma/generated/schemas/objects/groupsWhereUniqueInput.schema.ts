import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const groupsWhereUniqueInputObjectSchema: z.ZodType<Prisma.groupsWhereUniqueInput, Prisma.groupsWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const groupsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
