// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { Source_connectionsScalarRelationFilterObjectSchema } from './Source_connectionsScalarRelationFilter.schema';
import { source_connectionsWhereInputObjectSchema } from './source_connectionsWhereInput.schema'

export const source_connection_secretsWhereInputObjectSchema: z.ZodType<Prisma.source_connection_secretsWhereInput, Prisma.source_connection_secretsWhereInput> = z.object({
  AND: z.union([z.lazy(() => source_connection_secretsWhereInputObjectSchema), z.lazy(() => source_connection_secretsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => source_connection_secretsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => source_connection_secretsWhereInputObjectSchema), z.lazy(() => source_connection_secretsWhereInputObjectSchema).array()]).optional(),
  connection_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  password: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  source_connections: z.union([z.lazy(() => Source_connectionsScalarRelationFilterObjectSchema), z.lazy(() => source_connectionsWhereInputObjectSchema)]).optional()
}).strict();
export const source_connection_secretsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => source_connection_secretsWhereInputObjectSchema), z.lazy(() => source_connection_secretsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => source_connection_secretsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => source_connection_secretsWhereInputObjectSchema), z.lazy(() => source_connection_secretsWhereInputObjectSchema).array()]).optional(),
  connection_id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  password: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  source_connections: z.union([z.lazy(() => Source_connectionsScalarRelationFilterObjectSchema), z.lazy(() => source_connectionsWhereInputObjectSchema)]).optional()
}).strict();
