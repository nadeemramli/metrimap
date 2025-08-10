import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const projectsWhereUniqueInputObjectSchema: z.ZodType<Prisma.projectsWhereUniqueInput, Prisma.projectsWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const projectsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
