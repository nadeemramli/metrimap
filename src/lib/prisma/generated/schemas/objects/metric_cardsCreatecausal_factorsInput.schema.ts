import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const metric_cardsCreatecausal_factorsInputObjectSchema: z.ZodType<Prisma.metric_cardsCreatecausal_factorsInput, Prisma.metric_cardsCreatecausal_factorsInput> = z.object({
  set: z.string().array()
}).strict();
export const metric_cardsCreatecausal_factorsInputObjectZodSchema = z.object({
  set: z.string().array()
}).strict();
