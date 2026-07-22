// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_accountsArgsObjectSchema } from './connected_accountsArgs.schema';
import { tracked_metricsArgsObjectSchema } from './tracked_metricsArgs.schema'

export const metric_bindingsIncludeObjectSchema: z.ZodType<Prisma.metric_bindingsInclude, Prisma.metric_bindingsInclude> = z.object({
  connected_accounts: z.union([z.boolean(), z.lazy(() => connected_accountsArgsObjectSchema)]).optional(),
  tracked_metrics: z.union([z.boolean(), z.lazy(() => tracked_metricsArgsObjectSchema)]).optional()
}).strict();
export const metric_bindingsIncludeObjectZodSchema = z.object({
  connected_accounts: z.union([z.boolean(), z.lazy(() => connected_accountsArgsObjectSchema)]).optional(),
  tracked_metrics: z.union([z.boolean(), z.lazy(() => tracked_metricsArgsObjectSchema)]).optional()
}).strict();
