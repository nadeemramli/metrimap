import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const projectsCreatetagsInputObjectSchema: z.ZodType<Prisma.projectsCreatetagsInput, Prisma.projectsCreatetagsInput> = z.object({
  set: z.string().array()
}).strict();
export const projectsCreatetagsInputObjectZodSchema = z.object({
  set: z.string().array()
}).strict();
