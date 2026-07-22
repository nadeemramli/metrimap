// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const node_access_grantsCreateManyMetric_cardsInputObjectSchema: z.ZodType<Prisma.node_access_grantsCreateManyMetric_cardsInput, Prisma.node_access_grantsCreateManyMetric_cardsInput> = z.object({
  group_id: z.string()
}).strict();
export const node_access_grantsCreateManyMetric_cardsInputObjectZodSchema = z.object({
  group_id: z.string()
}).strict();
