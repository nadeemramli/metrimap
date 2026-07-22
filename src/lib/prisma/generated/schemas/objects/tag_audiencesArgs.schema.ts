// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tag_audiencesSelectObjectSchema } from './tag_audiencesSelect.schema';
import { tag_audiencesIncludeObjectSchema } from './tag_audiencesInclude.schema'

export const tag_audiencesArgsObjectSchema = z.object({
  select: z.lazy(() => tag_audiencesSelectObjectSchema).optional(),
  include: z.lazy(() => tag_audiencesIncludeObjectSchema).optional()
}).strict();
export const tag_audiencesArgsObjectZodSchema = z.object({
  select: z.lazy(() => tag_audiencesSelectObjectSchema).optional(),
  include: z.lazy(() => tag_audiencesIncludeObjectSchema).optional()
}).strict();
