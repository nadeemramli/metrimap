// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { Source_connection_secretsNullableScalarRelationFilterObjectSchema } from './Source_connection_secretsNullableScalarRelationFilter.schema';
import { source_connection_secretsWhereInputObjectSchema } from './source_connection_secretsWhereInput.schema'

export const source_connectionsWhereInputObjectSchema: z.ZodType<Prisma.source_connectionsWhereInput, Prisma.source_connectionsWhereInput> = z.object({
  AND: z.union([z.lazy(() => source_connectionsWhereInputObjectSchema), z.lazy(() => source_connectionsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => source_connectionsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => source_connectionsWhereInputObjectSchema), z.lazy(() => source_connectionsWhereInputObjectSchema).array()]).optional(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  warehouse_type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  host: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  port: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  database: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  username: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  ssl: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  source_connection_secrets: z.union([z.lazy(() => Source_connection_secretsNullableScalarRelationFilterObjectSchema), z.lazy(() => source_connection_secretsWhereInputObjectSchema)]).optional().nullable()
}).strict();
export const source_connectionsWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => source_connectionsWhereInputObjectSchema), z.lazy(() => source_connectionsWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => source_connectionsWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => source_connectionsWhereInputObjectSchema), z.lazy(() => source_connectionsWhereInputObjectSchema).array()]).optional(),
  created_by: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  warehouse_type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  host: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  port: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  database: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  username: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  ssl: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional(),
  workspace_id: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  source_connection_secrets: z.union([z.lazy(() => Source_connection_secretsNullableScalarRelationFilterObjectSchema), z.lazy(() => source_connection_secretsWhereInputObjectSchema)]).optional().nullable()
}).strict();
