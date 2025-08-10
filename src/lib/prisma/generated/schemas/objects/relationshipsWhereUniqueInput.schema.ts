import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const relationshipsWhereUniqueInputObjectSchema: z.ZodType<Prisma.relationshipsWhereUniqueInput, Prisma.relationshipsWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const relationshipsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
