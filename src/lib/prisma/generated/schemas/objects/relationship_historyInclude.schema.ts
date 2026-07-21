// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsArgsObjectSchema } from './projectsArgs.schema';
import { relationshipsArgsObjectSchema } from './relationshipsArgs.schema'

export const relationship_historyIncludeObjectSchema: z.ZodType<Prisma.relationship_historyInclude, Prisma.relationship_historyInclude> = z.object({
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  relationships: z.union([z.boolean(), z.lazy(() => relationshipsArgsObjectSchema)]).optional()
}).strict();
export const relationship_historyIncludeObjectZodSchema = z.object({
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  relationships: z.union([z.boolean(), z.lazy(() => relationshipsArgsObjectSchema)]).optional()
}).strict();
