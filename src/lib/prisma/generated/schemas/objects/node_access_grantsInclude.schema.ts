// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { workspace_groupsArgsObjectSchema } from './workspace_groupsArgs.schema';
import { metric_cardsArgsObjectSchema } from './metric_cardsArgs.schema'

export const node_access_grantsIncludeObjectSchema: z.ZodType<Prisma.node_access_grantsInclude, Prisma.node_access_grantsInclude> = z.object({
  workspace_groups: z.union([z.boolean(), z.lazy(() => workspace_groupsArgsObjectSchema)]).optional(),
  metric_cards: z.union([z.boolean(), z.lazy(() => metric_cardsArgsObjectSchema)]).optional()
}).strict();
export const node_access_grantsIncludeObjectZodSchema = z.object({
  workspace_groups: z.union([z.boolean(), z.lazy(() => workspace_groupsArgsObjectSchema)]).optional(),
  metric_cards: z.union([z.boolean(), z.lazy(() => metric_cardsArgsObjectSchema)]).optional()
}).strict();
