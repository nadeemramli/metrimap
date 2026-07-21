// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connector_cursorsWhereInputObjectSchema } from './connector_cursorsWhereInput.schema'

export const Connector_cursorsListRelationFilterObjectSchema: z.ZodType<Prisma.Connector_cursorsListRelationFilter, Prisma.Connector_cursorsListRelationFilter> = z.object({
  every: z.lazy(() => connector_cursorsWhereInputObjectSchema).optional(),
  some: z.lazy(() => connector_cursorsWhereInputObjectSchema).optional(),
  none: z.lazy(() => connector_cursorsWhereInputObjectSchema).optional()
}).strict();
export const Connector_cursorsListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => connector_cursorsWhereInputObjectSchema).optional(),
  some: z.lazy(() => connector_cursorsWhereInputObjectSchema).optional(),
  none: z.lazy(() => connector_cursorsWhereInputObjectSchema).optional()
}).strict();
