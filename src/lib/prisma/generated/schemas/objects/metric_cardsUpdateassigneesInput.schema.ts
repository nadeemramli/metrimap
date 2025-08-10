import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const metric_cardsUpdateassigneesInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdateassigneesInput, Prisma.metric_cardsUpdateassigneesInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([z.string(), z.string().array()]).optional()
}).strict();
export const metric_cardsUpdateassigneesInputObjectZodSchema = z.object({
  set: z.string().array().optional(),
  push: z.union([z.string(), z.string().array()]).optional()
}).strict();
