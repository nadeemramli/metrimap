// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsSelectObjectSchema } from './relationshipsSelect.schema';
import { relationshipsIncludeObjectSchema } from './relationshipsInclude.schema'

export const relationshipsArgsObjectSchema = z.object({
  select: z.lazy(() => relationshipsSelectObjectSchema).optional(),
  include: z.lazy(() => relationshipsIncludeObjectSchema).optional()
}).strict();
export const relationshipsArgsObjectZodSchema = z.object({
  select: z.lazy(() => relationshipsSelectObjectSchema).optional(),
  include: z.lazy(() => relationshipsIncludeObjectSchema).optional()
}).strict();
