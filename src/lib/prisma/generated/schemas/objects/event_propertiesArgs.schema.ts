// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { event_propertiesSelectObjectSchema } from './event_propertiesSelect.schema';
import { event_propertiesIncludeObjectSchema } from './event_propertiesInclude.schema'

export const event_propertiesArgsObjectSchema = z.object({
  select: z.lazy(() => event_propertiesSelectObjectSchema).optional(),
  include: z.lazy(() => event_propertiesIncludeObjectSchema).optional()
}).strict();
export const event_propertiesArgsObjectZodSchema = z.object({
  select: z.lazy(() => event_propertiesSelectObjectSchema).optional(),
  include: z.lazy(() => event_propertiesIncludeObjectSchema).optional()
}).strict();
