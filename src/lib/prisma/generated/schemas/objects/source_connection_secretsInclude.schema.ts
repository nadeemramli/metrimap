// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { source_connectionsArgsObjectSchema } from './source_connectionsArgs.schema'

export const source_connection_secretsIncludeObjectSchema: z.ZodType<Prisma.source_connection_secretsInclude, Prisma.source_connection_secretsInclude> = z.object({
  source_connections: z.union([z.boolean(), z.lazy(() => source_connectionsArgsObjectSchema)]).optional()
}).strict();
export const source_connection_secretsIncludeObjectZodSchema = z.object({
  source_connections: z.union([z.boolean(), z.lazy(() => source_connectionsArgsObjectSchema)]).optional()
}).strict();
