import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const metric_cardsCreatedimensionsInputObjectSchema: z.ZodType<Prisma.metric_cardsCreatedimensionsInput, Prisma.metric_cardsCreatedimensionsInput> = z.object({
  set: z.string().array()
}).strict();
export const metric_cardsCreatedimensionsInputObjectZodSchema = z.object({
  set: z.string().array()
}).strict();
