// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const metric_card_tagsMetric_card_idTag_idCompoundUniqueInputObjectSchema: z.ZodType<Prisma.metric_card_tagsMetric_card_idTag_idCompoundUniqueInput, Prisma.metric_card_tagsMetric_card_idTag_idCompoundUniqueInput> = z.object({
  metric_card_id: z.string(),
  tag_id: z.string()
}).strict();
export const metric_card_tagsMetric_card_idTag_idCompoundUniqueInputObjectZodSchema = z.object({
  metric_card_id: z.string(),
  tag_id: z.string()
}).strict();
