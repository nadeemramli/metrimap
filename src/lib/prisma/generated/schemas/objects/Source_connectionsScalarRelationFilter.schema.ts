// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { source_connectionsWhereInputObjectSchema } from './source_connectionsWhereInput.schema'

export const Source_connectionsScalarRelationFilterObjectSchema: z.ZodType<Prisma.Source_connectionsScalarRelationFilter, Prisma.Source_connectionsScalarRelationFilter> = z.object({
  is: z.lazy(() => source_connectionsWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => source_connectionsWhereInputObjectSchema).optional()
}).strict();
export const Source_connectionsScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => source_connectionsWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => source_connectionsWhereInputObjectSchema).optional()
}).strict();
