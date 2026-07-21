// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { Metric_card_tagsFindManySchema } from '../findManymetric_card_tags.schema';
import { Relationship_tagsFindManySchema } from '../findManyrelationship_tags.schema';
import { Tag_audiencesFindManySchema } from '../findManytag_audiences.schema';
import { usersArgsObjectSchema } from './usersArgs.schema';
import { projectsArgsObjectSchema } from './projectsArgs.schema';
import { tagsCountOutputTypeArgsObjectSchema } from './tagsCountOutputTypeArgs.schema'

export const tagsSelectObjectSchema: z.ZodType<Prisma.tagsSelect, Prisma.tagsSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  color: z.boolean().optional(),
  description: z.boolean().optional(),
  project_id: z.boolean().optional(),
  created_by: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  is_access: z.boolean().optional(),
  redaction_mode: z.boolean().optional(),
  metric_card_tags: z.union([z.boolean(), z.lazy(() => Metric_card_tagsFindManySchema)]).optional(),
  relationship_tags: z.union([z.boolean(), z.lazy(() => Relationship_tagsFindManySchema)]).optional(),
  tag_audiences: z.union([z.boolean(), z.lazy(() => Tag_audiencesFindManySchema)]).optional(),
  users: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => tagsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const tagsSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  color: z.boolean().optional(),
  description: z.boolean().optional(),
  project_id: z.boolean().optional(),
  created_by: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  is_access: z.boolean().optional(),
  redaction_mode: z.boolean().optional(),
  metric_card_tags: z.union([z.boolean(), z.lazy(() => Metric_card_tagsFindManySchema)]).optional(),
  relationship_tags: z.union([z.boolean(), z.lazy(() => Relationship_tagsFindManySchema)]).optional(),
  tag_audiences: z.union([z.boolean(), z.lazy(() => Tag_audiencesFindManySchema)]).optional(),
  users: z.union([z.boolean(), z.lazy(() => usersArgsObjectSchema)]).optional(),
  projects: z.union([z.boolean(), z.lazy(() => projectsArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => tagsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
