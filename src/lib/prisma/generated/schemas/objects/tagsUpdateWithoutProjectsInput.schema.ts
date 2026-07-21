// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { metric_card_tagsUpdateManyWithoutTagsNestedInputObjectSchema } from './metric_card_tagsUpdateManyWithoutTagsNestedInput.schema';
import { relationship_tagsUpdateManyWithoutTagsNestedInputObjectSchema } from './relationship_tagsUpdateManyWithoutTagsNestedInput.schema';
import { tag_audiencesUpdateManyWithoutTagsNestedInputObjectSchema } from './tag_audiencesUpdateManyWithoutTagsNestedInput.schema';
import { usersUpdateOneWithoutTagsNestedInputObjectSchema } from './usersUpdateOneWithoutTagsNestedInput.schema'

export const tagsUpdateWithoutProjectsInputObjectSchema: z.ZodType<Prisma.tagsUpdateWithoutProjectsInput, Prisma.tagsUpdateWithoutProjectsInput> = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  color: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  is_access: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  redaction_mode: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  metric_card_tags: z.lazy(() => metric_card_tagsUpdateManyWithoutTagsNestedInputObjectSchema).optional(),
  relationship_tags: z.lazy(() => relationship_tagsUpdateManyWithoutTagsNestedInputObjectSchema).optional(),
  tag_audiences: z.lazy(() => tag_audiencesUpdateManyWithoutTagsNestedInputObjectSchema).optional(),
  users: z.lazy(() => usersUpdateOneWithoutTagsNestedInputObjectSchema).optional()
}).strict();
export const tagsUpdateWithoutProjectsInputObjectZodSchema = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  color: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  is_access: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  redaction_mode: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  metric_card_tags: z.lazy(() => metric_card_tagsUpdateManyWithoutTagsNestedInputObjectSchema).optional(),
  relationship_tags: z.lazy(() => relationship_tagsUpdateManyWithoutTagsNestedInputObjectSchema).optional(),
  tag_audiences: z.lazy(() => tag_audiencesUpdateManyWithoutTagsNestedInputObjectSchema).optional(),
  users: z.lazy(() => usersUpdateOneWithoutTagsNestedInputObjectSchema).optional()
}).strict();
