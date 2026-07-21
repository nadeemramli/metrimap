// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { metric_card_tagsUncheckedUpdateManyWithoutTagsNestedInputObjectSchema } from './metric_card_tagsUncheckedUpdateManyWithoutTagsNestedInput.schema';
import { relationship_tagsUncheckedUpdateManyWithoutTagsNestedInputObjectSchema } from './relationship_tagsUncheckedUpdateManyWithoutTagsNestedInput.schema';
import { tag_audiencesUncheckedUpdateManyWithoutTagsNestedInputObjectSchema } from './tag_audiencesUncheckedUpdateManyWithoutTagsNestedInput.schema'

export const tagsUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.tagsUncheckedUpdateInput, Prisma.tagsUncheckedUpdateInput> = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  color: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  project_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_by: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  is_access: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  redaction_mode: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  metric_card_tags: z.lazy(() => metric_card_tagsUncheckedUpdateManyWithoutTagsNestedInputObjectSchema).optional(),
  relationship_tags: z.lazy(() => relationship_tagsUncheckedUpdateManyWithoutTagsNestedInputObjectSchema).optional(),
  tag_audiences: z.lazy(() => tag_audiencesUncheckedUpdateManyWithoutTagsNestedInputObjectSchema).optional()
}).strict();
export const tagsUncheckedUpdateInputObjectZodSchema = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  color: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  project_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_by: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  is_access: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  redaction_mode: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  metric_card_tags: z.lazy(() => metric_card_tagsUncheckedUpdateManyWithoutTagsNestedInputObjectSchema).optional(),
  relationship_tags: z.lazy(() => relationship_tagsUncheckedUpdateManyWithoutTagsNestedInputObjectSchema).optional(),
  tag_audiences: z.lazy(() => tag_audiencesUncheckedUpdateManyWithoutTagsNestedInputObjectSchema).optional()
}).strict();
