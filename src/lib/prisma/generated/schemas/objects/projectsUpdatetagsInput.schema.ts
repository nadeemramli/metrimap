import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const projectsUpdatetagsInputObjectSchema: z.ZodType<Prisma.projectsUpdatetagsInput, Prisma.projectsUpdatetagsInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([z.string(), z.string().array()]).optional()
}).strict();
export const projectsUpdatetagsInputObjectZodSchema = z.object({
  set: z.string().array().optional(),
  push: z.union([z.string(), z.string().array()]).optional()
}).strict();
