// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { comment_likesUncheckedUpdateManyWithoutCommentsNestedInputObjectSchema } from './comment_likesUncheckedUpdateManyWithoutCommentsNestedInput.schema';
import { comment_mentionsUncheckedUpdateManyWithoutCommentsNestedInputObjectSchema } from './comment_mentionsUncheckedUpdateManyWithoutCommentsNestedInput.schema';
import { commentsUncheckedUpdateManyWithoutCommentsNestedInputObjectSchema } from './commentsUncheckedUpdateManyWithoutCommentsNestedInput.schema'

export const commentsUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.commentsUncheckedUpdateInput, Prisma.commentsUncheckedUpdateInput> = z.object({
  thread_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  author_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  content: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  resolved: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  parent_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  comment_likes: z.lazy(() => comment_likesUncheckedUpdateManyWithoutCommentsNestedInputObjectSchema).optional(),
  comment_mentions: z.lazy(() => comment_mentionsUncheckedUpdateManyWithoutCommentsNestedInputObjectSchema).optional(),
  other_comments: z.lazy(() => commentsUncheckedUpdateManyWithoutCommentsNestedInputObjectSchema).optional()
}).strict();
export const commentsUncheckedUpdateInputObjectZodSchema = z.object({
  thread_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  author_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  content: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  resolved: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  parent_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  comment_likes: z.lazy(() => comment_likesUncheckedUpdateManyWithoutCommentsNestedInputObjectSchema).optional(),
  comment_mentions: z.lazy(() => comment_mentionsUncheckedUpdateManyWithoutCommentsNestedInputObjectSchema).optional(),
  other_comments: z.lazy(() => commentsUncheckedUpdateManyWithoutCommentsNestedInputObjectSchema).optional()
}).strict();
