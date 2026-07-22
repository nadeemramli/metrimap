// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const node_access_grantsUncheckedCreateInputObjectSchema: z.ZodType<Prisma.node_access_grantsUncheckedCreateInput, Prisma.node_access_grantsUncheckedCreateInput> = z.object({
  metric_card_id: z.string(),
  group_id: z.string()
}).strict();
export const node_access_grantsUncheckedCreateInputObjectZodSchema = z.object({
  metric_card_id: z.string(),
  group_id: z.string()
}).strict();
