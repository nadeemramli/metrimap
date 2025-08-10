import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const metric_cardsUpdatecausal_factorsInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdatecausal_factorsInput, Prisma.metric_cardsUpdatecausal_factorsInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([z.string(), z.string().array()]).optional()
}).strict();
export const metric_cardsUpdatecausal_factorsInputObjectZodSchema = z.object({
  set: z.string().array().optional(),
  push: z.union([z.string(), z.string().array()]).optional()
}).strict();
