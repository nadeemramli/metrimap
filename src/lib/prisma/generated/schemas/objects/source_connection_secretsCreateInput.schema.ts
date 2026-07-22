// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { source_connectionsCreateNestedOneWithoutSource_connection_secretsInputObjectSchema } from './source_connectionsCreateNestedOneWithoutSource_connection_secretsInput.schema'

export const source_connection_secretsCreateInputObjectSchema: z.ZodType<Prisma.source_connection_secretsCreateInput, Prisma.source_connection_secretsCreateInput> = z.object({
  password: z.string(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  source_connections: z.lazy(() => source_connectionsCreateNestedOneWithoutSource_connection_secretsInputObjectSchema)
}).strict();
export const source_connection_secretsCreateInputObjectZodSchema = z.object({
  password: z.string(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional(),
  source_connections: z.lazy(() => source_connectionsCreateNestedOneWithoutSource_connection_secretsInputObjectSchema)
}).strict();
