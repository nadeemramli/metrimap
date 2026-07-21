// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UsersCountOutputTypeSelectObjectSchema } from './UsersCountOutputTypeSelect.schema'

export const UsersCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => UsersCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const UsersCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => UsersCountOutputTypeSelectObjectSchema).optional()
}).strict();
