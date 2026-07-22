// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema'

export const node_access_grantsScalarWhereInputObjectSchema: z.ZodType<Prisma.node_access_grantsScalarWhereInput, Prisma.node_access_grantsScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => node_access_grantsScalarWhereInputObjectSchema), z.lazy(() => node_access_grantsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => node_access_grantsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => node_access_grantsScalarWhereInputObjectSchema), z.lazy(() => node_access_grantsScalarWhereInputObjectSchema).array()]).optional(),
  metric_card_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  group_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional()
}).strict();
export const node_access_grantsScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => node_access_grantsScalarWhereInputObjectSchema), z.lazy(() => node_access_grantsScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => node_access_grantsScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => node_access_grantsScalarWhereInputObjectSchema), z.lazy(() => node_access_grantsScalarWhereInputObjectSchema).array()]).optional(),
  metric_card_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  group_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional()
}).strict();
