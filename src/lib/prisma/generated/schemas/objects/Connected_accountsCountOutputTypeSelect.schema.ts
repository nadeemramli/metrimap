// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';


export const Connected_accountsCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.Connected_accountsCountOutputTypeSelect, Prisma.Connected_accountsCountOutputTypeSelect> = z.object({
  connector_cursors: z.boolean().optional(),
  connector_runs: z.boolean().optional(),
  metric_bindings: z.boolean().optional()
}).strict();
export const Connected_accountsCountOutputTypeSelectObjectZodSchema = z.object({
  connector_cursors: z.boolean().optional(),
  connector_runs: z.boolean().optional(),
  metric_bindings: z.boolean().optional()
}).strict();
