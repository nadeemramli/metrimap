// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { Connected_accountsCountOutputTypeSelectObjectSchema } from './Connected_accountsCountOutputTypeSelect.schema'

export const Connected_accountsCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => Connected_accountsCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const Connected_accountsCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => Connected_accountsCountOutputTypeSelectObjectSchema).optional()
}).strict();
