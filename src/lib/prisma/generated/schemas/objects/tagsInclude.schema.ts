// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { Metric_card_tagsFindManySchema } from '../findManymetric_card_tags.schema';
import { Relationship_tagsFindManySchema } from '../findManyrelationship_tags.schema';
import { Tag_audiencesFindManySchema } from '../findManytag_audiences.schema';
import { usersArgsObjectSchema } from './usersArgs.schema';
import { projectsArgsObjectSchema } from './projectsArgs.schema';
import { tagsCountOutputTypeArgsObjectSchema } from './tagsCountOutputTypeArgs.schema'

export const tagsIncludeObjectSchema: z.ZodType<Prisma.tagsInclude, Prisma.tagsInclude> = z.object({
  metric_card_tags: z.union([z.boolean(), z.lazy(() => Metric_card_tagsFindManySchema)]).optional(),
  relationship_tags: z.union([z.boolean(), z.lazy(() => Relationship_tagsFindManySchema)]).optional(),
  tag_audiences: z.union([z.boolean(), z.lazy(() => Tag_audiencesFindManySchema)]).optional(),
  users: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => tagsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const tagsIncludeObjectZodSchema = z.object({
  metric_card_tags: z.union([z.boolean(), z.lazy(() => Metric_card_tagsFindManySchema)]).optional(),
  relationship_tags: z.union([z.boolean(), z.lazy(() => Relationship_tagsFindManySchema)]).optional(),
  tag_audiences: z.union([z.boolean(), z.lazy(() => Tag_audiencesFindManySchema)]).optional(),
  users: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => tagsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
