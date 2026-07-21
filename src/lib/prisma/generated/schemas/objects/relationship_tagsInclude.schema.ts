// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsArgsObjectSchema } from './relationshipsArgs.schema';
import { tagsArgsObjectSchema } from './tagsArgs.schema'

export const relationship_tagsIncludeObjectSchema: z.ZodType<Prisma.relationship_tagsInclude, Prisma.relationship_tagsInclude> = z.object({
  relationships: z.union([z.boolean(), z.lazy(() => relationshipsArgsObjectSchema)]).optional(),
  tags: z.union([z.boolean(), z.lazy(() => tagsArgsObjectSchema)]).optional()
}).strict();
export const relationship_tagsIncludeObjectZodSchema = z.object({
  relationships: z.union([z.boolean(), z.lazy(() => relationshipsArgsObjectSchema)]).optional(),
  tags: z.union([z.boolean(), z.lazy(() => tagsArgsObjectSchema)]).optional()
}).strict();
