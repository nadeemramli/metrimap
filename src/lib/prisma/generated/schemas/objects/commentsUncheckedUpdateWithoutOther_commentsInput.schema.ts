// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { comment_likesUncheckedUpdateManyWithoutCommentsNestedInputObjectSchema } from './comment_likesUncheckedUpdateManyWithoutCommentsNestedInput.schema';
import { comment_mentionsUncheckedUpdateManyWithoutCommentsNestedInputObjectSchema } from './comment_mentionsUncheckedUpdateManyWithoutCommentsNestedInput.schema'

export const commentsUncheckedUpdateWithoutOther_commentsInputObjectSchema: z.ZodType<Prisma.commentsUncheckedUpdateWithoutOther_commentsInput, Prisma.commentsUncheckedUpdateWithoutOther_commentsInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  thread_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  author_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  content: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  resolved: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  parent_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  comment_likes: z.lazy(() => comment_likesUncheckedUpdateManyWithoutCommentsNestedInputObjectSchema).optional(),
  comment_mentions: z.lazy(() => comment_mentionsUncheckedUpdateManyWithoutCommentsNestedInputObjectSchema).optional()
}).strict();
export const commentsUncheckedUpdateWithoutOther_commentsInputObjectZodSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  thread_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  author_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  content: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  resolved: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  parent_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  comment_likes: z.lazy(() => comment_likesUncheckedUpdateManyWithoutCommentsNestedInputObjectSchema).optional(),
  comment_mentions: z.lazy(() => comment_mentionsUncheckedUpdateManyWithoutCommentsNestedInputObjectSchema).optional()
}).strict();
