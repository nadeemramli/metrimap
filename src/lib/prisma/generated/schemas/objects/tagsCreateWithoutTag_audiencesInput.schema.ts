// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { metric_card_tagsCreateNestedManyWithoutTagsInputObjectSchema } from './metric_card_tagsCreateNestedManyWithoutTagsInput.schema';
import { relationship_tagsCreateNestedManyWithoutTagsInputObjectSchema } from './relationship_tagsCreateNestedManyWithoutTagsInput.schema';
import { usersCreateNestedOneWithoutTagsInputObjectSchema } from './usersCreateNestedOneWithoutTagsInput.schema';
import { projectsCreateNestedOneWithoutTag_recordsInputObjectSchema } from './projectsCreateNestedOneWithoutTag_recordsInput.schema'

export const tagsCreateWithoutTag_audiencesInputObjectSchema: z.ZodType<Prisma.tagsCreateWithoutTag_audiencesInput, Prisma.tagsCreateWithoutTag_audiencesInput> = z.object({
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
  users: z.lazy(() => usersCreateNestedOneWithoutTagsInputObjectSchema).optional(),
  projects: z.lazy(() => projectsCreateNestedOneWithoutTag_recordsInputObjectSchema).optional()
}).strict();
export const tagsCreateWithoutTag_audiencesInputObjectZodSchema = z.object({
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
  users: z.lazy(() => usersCreateNestedOneWithoutTagsInputObjectSchema).optional(),
  projects: z.lazy(() => projectsCreateNestedOneWithoutTag_recordsInputObjectSchema).optional()
}).strict();
