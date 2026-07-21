// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tag_audiencesWhereInputObjectSchema } from './tag_audiencesWhereInput.schema'

export const Tag_audiencesListRelationFilterObjectSchema: z.ZodType<Prisma.Tag_audiencesListRelationFilter, Prisma.Tag_audiencesListRelationFilter> = z.object({
  every: z.lazy(() => tag_audiencesWhereInputObjectSchema).optional(),
  some: z.lazy(() => tag_audiencesWhereInputObjectSchema).optional(),
  none: z.lazy(() => tag_audiencesWhereInputObjectSchema).optional()
}).strict();
export const Tag_audiencesListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => tag_audiencesWhereInputObjectSchema).optional(),
  some: z.lazy(() => tag_audiencesWhereInputObjectSchema).optional(),
  none: z.lazy(() => tag_audiencesWhereInputObjectSchema).optional()
}).strict();
