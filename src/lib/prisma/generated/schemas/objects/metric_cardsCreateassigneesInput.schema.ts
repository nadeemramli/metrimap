import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const metric_cardsCreateassigneesInputObjectSchema: z.ZodType<Prisma.metric_cardsCreateassigneesInput, Prisma.metric_cardsCreateassigneesInput> = z.object({
  set: z.string().array()
}).strict();
export const metric_cardsCreateassigneesInputObjectZodSchema = z.object({
  set: z.string().array()
}).strict();
