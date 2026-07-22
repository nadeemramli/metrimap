// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const node_access_grantsCreateManyInputObjectSchema: z.ZodType<Prisma.node_access_grantsCreateManyInput, Prisma.node_access_grantsCreateManyInput> = z.object({
  metric_card_id: z.string(),
  group_id: z.string()
}).strict();
export const node_access_grantsCreateManyInputObjectZodSchema = z.object({
  metric_card_id: z.string(),
  group_id: z.string()
}).strict();
