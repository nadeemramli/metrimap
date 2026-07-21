// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { source_connection_secretsSelectObjectSchema } from './source_connection_secretsSelect.schema';
import { source_connection_secretsIncludeObjectSchema } from './source_connection_secretsInclude.schema'

export const source_connection_secretsArgsObjectSchema = z.object({
  select: z.lazy(() => source_connection_secretsSelectObjectSchema).optional(),
  include: z.lazy(() => source_connection_secretsIncludeObjectSchema).optional()
}).strict();
export const source_connection_secretsArgsObjectZodSchema = z.object({
  select: z.lazy(() => source_connection_secretsSelectObjectSchema).optional(),
  include: z.lazy(() => source_connection_secretsIncludeObjectSchema).optional()
}).strict();
