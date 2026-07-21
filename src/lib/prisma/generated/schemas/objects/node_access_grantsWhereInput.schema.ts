// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { Workspace_groupsScalarRelationFilterObjectSchema } from './Workspace_groupsScalarRelationFilter.schema';
import { workspace_groupsWhereInputObjectSchema } from './workspace_groupsWhereInput.schema';
import { Metric_cardsScalarRelationFilterObjectSchema } from './Metric_cardsScalarRelationFilter.schema';
import { metric_cardsWhereInputObjectSchema } from './metric_cardsWhereInput.schema'

export const node_access_grantsWhereInputObjectSchema: z.ZodType<Prisma.node_access_grantsWhereInput, Prisma.node_access_grantsWhereInput> = z.object({
  AND: z.union([z.lazy(() => node_access_grantsWhereInputObjectSchema), z.lazy(() => node_access_grantsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => node_access_grantsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => node_access_grantsWhereInputObjectSchema), z.lazy(() => node_access_grantsWhereInputObjectSchema).array()]).optional(),
  metric_card_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  group_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  workspace_groups: z.union([z.lazy(() => Workspace_groupsScalarRelationFilterObjectSchema), z.lazy(() => workspace_groupsWhereInputObjectSchema)]).optional(),
  metric_cards: z.union([z.lazy(() => Metric_cardsScalarRelationFilterObjectSchema), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional()
}).strict();
export const node_access_grantsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => node_access_grantsWhereInputObjectSchema), z.lazy(() => node_access_grantsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => node_access_grantsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => node_access_grantsWhereInputObjectSchema), z.lazy(() => node_access_grantsWhereInputObjectSchema).array()]).optional(),
  metric_card_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  group_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  workspace_groups: z.union([z.lazy(() => Workspace_groupsScalarRelationFilterObjectSchema), z.lazy(() => workspace_groupsWhereInputObjectSchema)]).optional(),
  metric_cards: z.union([z.lazy(() => Metric_cardsScalarRelationFilterObjectSchema), z.lazy(() => metric_cardsWhereInputObjectSchema)]).optional()
}).strict();
