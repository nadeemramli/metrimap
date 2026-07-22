// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SpacesCountOutputTypeSelectObjectSchema } from './SpacesCountOutputTypeSelect.schema'

export const SpacesCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => SpacesCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const SpacesCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => SpacesCountOutputTypeSelectObjectSchema).optional()
}).strict();
