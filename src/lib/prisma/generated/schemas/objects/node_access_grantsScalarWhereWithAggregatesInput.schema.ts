// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidWithAggregatesFilterObjectSchema } from './UuidWithAggregatesFilter.schema'

export const node_access_grantsScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.node_access_grantsScalarWhereWithAggregatesInput, Prisma.node_access_grantsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => node_access_grantsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => node_access_grantsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => node_access_grantsScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => node_access_grantsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => node_access_grantsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  metric_card_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  group_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
export const node_access_grantsScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => node_access_grantsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => node_access_grantsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => node_access_grantsScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => node_access_grantsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => node_access_grantsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  metric_card_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  group_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
