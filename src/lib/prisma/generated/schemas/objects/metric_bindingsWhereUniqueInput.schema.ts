// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_bindingsConnected_account_idStreamTracked_metric_idCompoundUniqueInputObjectSchema } from './metric_bindingsConnected_account_idStreamTracked_metric_idCompoundUniqueInput.schema'

export const metric_bindingsWhereUniqueInputObjectSchema: z.ZodType<Prisma.metric_bindingsWhereUniqueInput, Prisma.metric_bindingsWhereUniqueInput> = z.object({
  id: z.string(),
  connected_account_id_stream_tracked_metric_id: z.lazy(() => metric_bindingsConnected_account_idStreamTracked_metric_idCompoundUniqueInputObjectSchema)
}).strict();
export const metric_bindingsWhereUniqueInputObjectZodSchema = z.object({
  id: z.string(),
  connected_account_id_stream_tracked_metric_id: z.lazy(() => metric_bindingsConnected_account_idStreamTracked_metric_idCompoundUniqueInputObjectSchema)
}).strict();
