// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { node_access_grantsMetric_card_idGroup_idCompoundUniqueInputObjectSchema } from './node_access_grantsMetric_card_idGroup_idCompoundUniqueInput.schema'

export const node_access_grantsWhereUniqueInputObjectSchema: z.ZodType<Prisma.node_access_grantsWhereUniqueInput, Prisma.node_access_grantsWhereUniqueInput> = z.object({
  metric_card_id_group_id: z.lazy(() => node_access_grantsMetric_card_idGroup_idCompoundUniqueInputObjectSchema)
}).strict();
export const node_access_grantsWhereUniqueInputObjectZodSchema = z.object({
  metric_card_id_group_id: z.lazy(() => node_access_grantsMetric_card_idGroup_idCompoundUniqueInputObjectSchema)
}).strict();
