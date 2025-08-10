import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const metric_card_tagsWhereUniqueInputObjectSchema: z.ZodType<Prisma.metric_card_tagsWhereUniqueInput, Prisma.metric_card_tagsWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const metric_card_tagsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
