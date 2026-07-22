// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const node_access_grantsMetric_card_idGroup_idCompoundUniqueInputObjectSchema: z.ZodType<Prisma.node_access_grantsMetric_card_idGroup_idCompoundUniqueInput, Prisma.node_access_grantsMetric_card_idGroup_idCompoundUniqueInput> = z.object({
  metric_card_id: z.string(),
  group_id: z.string()
}).strict();
export const node_access_grantsMetric_card_idGroup_idCompoundUniqueInputObjectZodSchema = z.object({
  metric_card_id: z.string(),
  group_id: z.string()
}).strict();
