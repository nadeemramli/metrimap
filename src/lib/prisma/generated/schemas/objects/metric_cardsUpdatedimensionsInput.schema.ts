import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const metric_cardsUpdatedimensionsInputObjectSchema: z.ZodType<Prisma.metric_cardsUpdatedimensionsInput, Prisma.metric_cardsUpdatedimensionsInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([z.string(), z.string().array()]).optional()
}).strict();
export const metric_cardsUpdatedimensionsInputObjectZodSchema = z.object({
  set: z.string().array().optional(),
  push: z.union([z.string(), z.string().array()]).optional()
}).strict();
