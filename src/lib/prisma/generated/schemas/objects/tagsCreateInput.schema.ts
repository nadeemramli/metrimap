// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_card_tagsCreateNestedManyWithoutTagsInputObjectSchema } from './metric_card_tagsCreateNestedManyWithoutTagsInput.schema';
import { relationship_tagsCreateNestedManyWithoutTagsInputObjectSchema } from './relationship_tagsCreateNestedManyWithoutTagsInput.schema';
import { tag_audiencesCreateNestedManyWithoutTagsInputObjectSchema } from './tag_audiencesCreateNestedManyWithoutTagsInput.schema';
import { usersCreateNestedOneWithoutTagsInputObjectSchema } from './usersCreateNestedOneWithoutTagsInput.schema';
import { projectsCreateNestedOneWithoutTag_recordsInputObjectSchema } from './projectsCreateNestedOneWithoutTag_recordsInput.schema'

export const tagsCreateInputObjectSchema: z.ZodType<Prisma.tagsCreateInput, Prisma.tagsCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  color: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  is_access: z.boolean().optional(),
  redaction_mode: z.string().optional(),
  metric_card_tags: z.lazy(() => metric_card_tagsCreateNestedManyWithoutTagsInputObjectSchema).optional(),
  relationship_tags: z.lazy(() => relationship_tagsCreateNestedManyWithoutTagsInputObjectSchema).optional(),
  tag_audiences: z.lazy(() => tag_audiencesCreateNestedManyWithoutTagsInputObjectSchema).optional(),
  users: z.lazy(() => usersCreateNestedOneWithoutTagsInputObjectSchema).optional(),
  projects: z.lazy(() => projectsCreateNestedOneWithoutTag_recordsInputObjectSchema).optional()
}).strict();
export const tagsCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  color: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  is_access: z.boolean().optional(),
  redaction_mode: z.string().optional(),
  metric_card_tags: z.lazy(() => metric_card_tagsCreateNestedManyWithoutTagsInputObjectSchema).optional(),
  relationship_tags: z.lazy(() => relationship_tagsCreateNestedManyWithoutTagsInputObjectSchema).optional(),
  tag_audiences: z.lazy(() => tag_audiencesCreateNestedManyWithoutTagsInputObjectSchema).optional(),
  users: z.lazy(() => usersCreateNestedOneWithoutTagsInputObjectSchema).optional(),
  projects: z.lazy(() => projectsCreateNestedOneWithoutTag_recordsInputObjectSchema).optional()
}).strict();
