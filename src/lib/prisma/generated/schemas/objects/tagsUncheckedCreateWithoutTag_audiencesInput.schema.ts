// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_card_tagsUncheckedCreateNestedManyWithoutTagsInputObjectSchema } from './metric_card_tagsUncheckedCreateNestedManyWithoutTagsInput.schema';
import { relationship_tagsUncheckedCreateNestedManyWithoutTagsInputObjectSchema } from './relationship_tagsUncheckedCreateNestedManyWithoutTagsInput.schema'

export const tagsUncheckedCreateWithoutTag_audiencesInputObjectSchema: z.ZodType<Prisma.tagsUncheckedCreateWithoutTag_audiencesInput, Prisma.tagsUncheckedCreateWithoutTag_audiencesInput> = z.object({
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
  relationship_tags: z.lazy(() => relationship_tagsUncheckedCreateNestedManyWithoutTagsInputObjectSchema).optional()
}).strict();
export const tagsUncheckedCreateWithoutTag_audiencesInputObjectZodSchema = z.object({
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
  relationship_tags: z.lazy(() => relationship_tagsUncheckedCreateNestedManyWithoutTagsInputObjectSchema).optional()
}).strict();
