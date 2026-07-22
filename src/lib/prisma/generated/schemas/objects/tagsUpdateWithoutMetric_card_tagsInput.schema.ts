// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { relationship_tagsUpdateManyWithoutTagsNestedInputObjectSchema } from './relationship_tagsUpdateManyWithoutTagsNestedInput.schema';
import { tag_audiencesUpdateManyWithoutTagsNestedInputObjectSchema } from './tag_audiencesUpdateManyWithoutTagsNestedInput.schema';
import { usersUpdateOneWithoutTagsNestedInputObjectSchema } from './usersUpdateOneWithoutTagsNestedInput.schema';
import { projectsUpdateOneWithoutTag_recordsNestedInputObjectSchema } from './projectsUpdateOneWithoutTag_recordsNestedInput.schema'

export const tagsUpdateWithoutMetric_card_tagsInputObjectSchema: z.ZodType<Prisma.tagsUpdateWithoutMetric_card_tagsInput, Prisma.tagsUpdateWithoutMetric_card_tagsInput> = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  color: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  is_access: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  redaction_mode: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  relationship_tags: z.lazy(() => relationship_tagsUpdateManyWithoutTagsNestedInputObjectSchema).optional(),
  tag_audiences: z.lazy(() => tag_audiencesUpdateManyWithoutTagsNestedInputObjectSchema).optional(),
  users: z.lazy(() => usersUpdateOneWithoutTagsNestedInputObjectSchema).optional(),
  projects: z.lazy(() => projectsUpdateOneWithoutTag_recordsNestedInputObjectSchema).optional()
}).strict();
export const tagsUpdateWithoutMetric_card_tagsInputObjectZodSchema = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  color: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  is_access: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  redaction_mode: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  relationship_tags: z.lazy(() => relationship_tagsUpdateManyWithoutTagsNestedInputObjectSchema).optional(),
  tag_audiences: z.lazy(() => tag_audiencesUpdateManyWithoutTagsNestedInputObjectSchema).optional(),
  users: z.lazy(() => usersUpdateOneWithoutTagsNestedInputObjectSchema).optional(),
  projects: z.lazy(() => projectsUpdateOneWithoutTag_recordsNestedInputObjectSchema).optional()
}).strict();
