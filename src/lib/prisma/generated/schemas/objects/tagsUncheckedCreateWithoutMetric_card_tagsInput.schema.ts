// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationship_tagsUncheckedCreateNestedManyWithoutTagsInputObjectSchema } from './relationship_tagsUncheckedCreateNestedManyWithoutTagsInput.schema';
import { tag_audiencesUncheckedCreateNestedManyWithoutTagsInputObjectSchema } from './tag_audiencesUncheckedCreateNestedManyWithoutTagsInput.schema'

export const tagsUncheckedCreateWithoutMetric_card_tagsInputObjectSchema: z.ZodType<Prisma.tagsUncheckedCreateWithoutMetric_card_tagsInput, Prisma.tagsUncheckedCreateWithoutMetric_card_tagsInput> = z.object({
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
  relationship_tags: z.lazy(() => relationship_tagsUncheckedCreateNestedManyWithoutTagsInputObjectSchema).optional(),
  tag_audiences: z.lazy(() => tag_audiencesUncheckedCreateNestedManyWithoutTagsInputObjectSchema).optional()
}).strict();
export const tagsUncheckedCreateWithoutMetric_card_tagsInputObjectZodSchema = z.object({
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
  relationship_tags: z.lazy(() => relationship_tagsUncheckedCreateNestedManyWithoutTagsInputObjectSchema).optional(),
  tag_audiences: z.lazy(() => tag_audiencesUncheckedCreateNestedManyWithoutTagsInputObjectSchema).optional()
}).strict();
