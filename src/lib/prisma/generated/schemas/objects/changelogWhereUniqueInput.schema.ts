import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const changelogWhereUniqueInputObjectSchema: z.ZodType<Prisma.changelogWhereUniqueInput, Prisma.changelogWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const changelogWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
