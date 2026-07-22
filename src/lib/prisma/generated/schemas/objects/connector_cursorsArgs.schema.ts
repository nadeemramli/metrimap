// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { connector_cursorsSelectObjectSchema } from './connector_cursorsSelect.schema';
import { connector_cursorsIncludeObjectSchema } from './connector_cursorsInclude.schema'

export const connector_cursorsArgsObjectSchema = z.object({
  select: z.lazy(() => connector_cursorsSelectObjectSchema).optional(),
  include: z.lazy(() => connector_cursorsIncludeObjectSchema).optional()
}).strict();
export const connector_cursorsArgsObjectZodSchema = z.object({
  select: z.lazy(() => connector_cursorsSelectObjectSchema).optional(),
  include: z.lazy(() => connector_cursorsIncludeObjectSchema).optional()
}).strict();
