// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { source_connection_secretsArgsObjectSchema } from './source_connection_secretsArgs.schema'

export const source_connectionsIncludeObjectSchema: z.ZodType<Prisma.source_connectionsInclude, Prisma.source_connectionsInclude> = z.object({
  source_connection_secrets: z.union([z.boolean(), z.lazy(() => source_connection_secretsArgsObjectSchema)]).optional()
}).strict();
export const source_connectionsIncludeObjectZodSchema = z.object({
  source_connection_secrets: z.union([z.boolean(), z.lazy(() => source_connection_secretsArgsObjectSchema)]).optional()
}).strict();
