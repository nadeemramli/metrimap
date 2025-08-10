import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const metric_cardsWhereUniqueInputObjectSchema: z.ZodType<Prisma.metric_cardsWhereUniqueInput, Prisma.metric_cardsWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const metric_cardsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
