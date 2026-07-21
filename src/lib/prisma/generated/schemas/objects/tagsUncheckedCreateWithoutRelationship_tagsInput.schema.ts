// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_card_tagsUncheckedCreateNestedManyWithoutTagsInputObjectSchema } from './metric_card_tagsUncheckedCreateNestedManyWithoutTagsInput.schema';
import { tag_audiencesUncheckedCreateNestedManyWithoutTagsInputObjectSchema } from './tag_audiencesUncheckedCreateNestedManyWithoutTagsInput.schema'

export const tagsUncheckedCreateWithoutRelationship_tagsInputObjectSchema: z.ZodType<Prisma.tagsUncheckedCreateWithoutRelationship_tagsInput, Prisma.tagsUncheckedCreateWithoutRelationship_tagsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  color: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  project_id: z.string().optional().nullable(),
  created_by: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  is_access: z.boolean().optional(),
  redaction_mode: z.string().optional(),
  metric_card_tags: z.lazy(() => metric_card_tagsUncheckedCreateNestedManyWithoutTagsInputObjectSchema).optional(),
  tag_audiences: z.lazy(() => tag_audiencesUncheckedCreateNestedManyWithoutTagsInputObjectSchema).optional()
}).strict();
export const tagsUncheckedCreateWithoutRelationship_tagsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  color: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  project_id: z.string().optional().nullable(),
  created_by: z.string().optional().nullable(),
  created_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  updated_at: z.union([z.date(), z.string().datetime()]).optional().nullable(),
  is_access: z.boolean().optional(),
  redaction_mode: z.string().optional(),
  metric_card_tags: z.lazy(() => metric_card_tagsUncheckedCreateNestedManyWithoutTagsInputObjectSchema).optional(),
  tag_audiences: z.lazy(() => tag_audiencesUncheckedCreateNestedManyWithoutTagsInputObjectSchema).optional()
}).strict();
