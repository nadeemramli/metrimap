// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { changelogWhereInputObjectSchema } from './changelogWhereInput.schema'

export const ChangelogListRelationFilterObjectSchema: z.ZodType<Prisma.ChangelogListRelationFilter, Prisma.ChangelogListRelationFilter> = z.object({
  every: z.lazy(() => changelogWhereInputObjectSchema).optional(),
  some: z.lazy(() => changelogWhereInputObjectSchema).optional(),
  none: z.lazy(() => changelogWhereInputObjectSchema).optional()
}).strict();
export const ChangelogListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => changelogWhereInputObjectSchema).optional(),
  some: z.lazy(() => changelogWhereInputObjectSchema).optional(),
  none: z.lazy(() => changelogWhereInputObjectSchema).optional()
}).strict();
