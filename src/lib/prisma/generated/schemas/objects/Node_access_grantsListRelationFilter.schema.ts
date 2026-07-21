// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { node_access_grantsWhereInputObjectSchema } from './node_access_grantsWhereInput.schema'

export const Node_access_grantsListRelationFilterObjectSchema: z.ZodType<Prisma.Node_access_grantsListRelationFilter, Prisma.Node_access_grantsListRelationFilter> = z.object({
  every: z.lazy(() => node_access_grantsWhereInputObjectSchema).optional(),
  some: z.lazy(() => node_access_grantsWhereInputObjectSchema).optional(),
  none: z.lazy(() => node_access_grantsWhereInputObjectSchema).optional()
}).strict();
export const Node_access_grantsListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => node_access_grantsWhereInputObjectSchema).optional(),
  some: z.lazy(() => node_access_grantsWhereInputObjectSchema).optional(),
  none: z.lazy(() => node_access_grantsWhereInputObjectSchema).optional()
}).strict();
