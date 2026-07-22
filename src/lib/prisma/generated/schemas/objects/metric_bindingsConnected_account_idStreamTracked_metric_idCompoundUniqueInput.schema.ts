// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const metric_bindingsConnected_account_idStreamTracked_metric_idCompoundUniqueInputObjectSchema: z.ZodType<Prisma.metric_bindingsConnected_account_idStreamTracked_metric_idCompoundUniqueInput, Prisma.metric_bindingsConnected_account_idStreamTracked_metric_idCompoundUniqueInput> = z.object({
  connected_account_id: z.string(),
  stream: z.string(),
  tracked_metric_id: z.string()
}).strict();
export const metric_bindingsConnected_account_idStreamTracked_metric_idCompoundUniqueInputObjectZodSchema = z.object({
  connected_account_id: z.string(),
  stream: z.string(),
  tracked_metric_id: z.string()
}).strict();
