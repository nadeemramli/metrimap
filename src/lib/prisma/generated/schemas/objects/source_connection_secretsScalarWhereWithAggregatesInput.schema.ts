// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidWithAggregatesFilterObjectSchema } from './UuidWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

export const source_connection_secretsScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.source_connection_secretsScalarWhereWithAggregatesInput, Prisma.source_connection_secretsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => source_connection_secretsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => source_connection_secretsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => source_connection_secretsScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => source_connection_secretsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => source_connection_secretsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  connection_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  password: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
export const source_connection_secretsScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => source_connection_secretsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => source_connection_secretsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => source_connection_secretsScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => source_connection_secretsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => source_connection_secretsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  connection_id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  password: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.union([z.date(), z.string().datetime()])]).optional()
}).strict();
