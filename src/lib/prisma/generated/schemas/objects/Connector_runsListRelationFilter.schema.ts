// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connector_runsWhereInputObjectSchema } from './connector_runsWhereInput.schema'

export const Connector_runsListRelationFilterObjectSchema: z.ZodType<Prisma.Connector_runsListRelationFilter, Prisma.Connector_runsListRelationFilter> = z.object({
  every: z.lazy(() => connector_runsWhereInputObjectSchema).optional(),
  some: z.lazy(() => connector_runsWhereInputObjectSchema).optional(),
  none: z.lazy(() => connector_runsWhereInputObjectSchema).optional()
}).strict();
export const Connector_runsListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => connector_runsWhereInputObjectSchema).optional(),
  some: z.lazy(() => connector_runsWhereInputObjectSchema).optional(),
  none: z.lazy(() => connector_runsWhereInputObjectSchema).optional()
}).strict();
