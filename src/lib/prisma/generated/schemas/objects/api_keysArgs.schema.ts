// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { api_keysSelectObjectSchema } from './api_keysSelect.schema'

export const api_keysArgsObjectSchema = z.object({
  select: z.lazy(() => api_keysSelectObjectSchema).optional()
}).strict();
export const api_keysArgsObjectZodSchema = z.object({
  select: z.lazy(() => api_keysSelectObjectSchema).optional()
}).strict();
