// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connected_account_secretsArgsObjectSchema } from './connected_account_secretsArgs.schema';
import { Connector_cursorsFindManySchema } from '../findManyconnector_cursors.schema';
import { Connector_runsFindManySchema } from '../findManyconnector_runs.schema';
import { Metric_bindingsFindManySchema } from '../findManymetric_bindings.schema';
import { connected_accountsCountOutputTypeArgsObjectSchema } from './connected_accountsCountOutputTypeArgs.schema'

export const connected_accountsIncludeObjectSchema: z.ZodType<Prisma.connected_accountsInclude, Prisma.connected_accountsInclude> = z.object({
  connected_account_secrets: z.union([z.boolean(), z.lazy(() => connected_account_secretsArgsObjectSchema)]).optional(),
  connector_cursors: z.union([z.boolean(), z.lazy(() => Connector_cursorsFindManySchema)]).optional(),
  connector_runs: z.union([z.boolean(), z.lazy(() => Connector_runsFindManySchema)]).optional(),
  metric_bindings: z.union([z.boolean(), z.lazy(() => Metric_bindingsFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => connected_accountsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const connected_accountsIncludeObjectZodSchema = z.object({
  connected_account_secrets: z.union([z.boolean(), z.lazy(() => connected_account_secretsArgsObjectSchema)]).optional(),
  connector_cursors: z.union([z.boolean(), z.lazy(() => Connector_cursorsFindManySchema)]).optional(),
  connector_runs: z.union([z.boolean(), z.lazy(() => Connector_runsFindManySchema)]).optional(),
  metric_bindings: z.union([z.boolean(), z.lazy(() => Metric_bindingsFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => connected_accountsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
