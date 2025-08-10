import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsSelectObjectSchema } from './relationshipsSelect.schema'

export const relationshipsArgsObjectSchema = z.object({
  select: z.lazy(() => relationshipsSelectObjectSchema).optional()
}).strict();
export const relationshipsArgsObjectZodSchema = z.object({
  select: z.lazy(() => relationshipsSelectObjectSchema).optional()
}).strict();
