// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { source_connectionsArgsObjectSchema } from './source_connectionsArgs.schema'

export const source_connection_secretsSelectObjectSchema: z.ZodType<Prisma.source_connection_secretsSelect, Prisma.source_connection_secretsSelect> = z.object({
  connection_id: z.boolean().optional(),
  password: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  source_connections: z.union([z.boolean(), z.lazy(() => source_connectionsArgsObjectSchema)]).optional()
}).strict();
export const source_connection_secretsSelectObjectZodSchema = z.object({
  connection_id: z.boolean().optional(),
  password: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  source_connections: z.union([z.boolean(), z.lazy(() => source_connectionsArgsObjectSchema)]).optional()
}).strict();
