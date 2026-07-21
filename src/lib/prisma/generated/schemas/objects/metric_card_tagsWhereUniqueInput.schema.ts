// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_card_tagsMetric_card_idTag_idCompoundUniqueInputObjectSchema } from './metric_card_tagsMetric_card_idTag_idCompoundUniqueInput.schema'

export const metric_card_tagsWhereUniqueInputObjectSchema: z.ZodType<Prisma.metric_card_tagsWhereUniqueInput, Prisma.metric_card_tagsWhereUniqueInput> = z.object({
  id: z.string(),
  metric_card_id_tag_id: z.lazy(() => metric_card_tagsMetric_card_idTag_idCompoundUniqueInputObjectSchema)
}).strict();
export const metric_card_tagsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string(),
  metric_card_id_tag_id: z.lazy(() => metric_card_tagsMetric_card_idTag_idCompoundUniqueInputObjectSchema)
}).strict();
