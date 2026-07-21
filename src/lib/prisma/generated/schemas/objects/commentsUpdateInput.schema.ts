// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { comment_likesUpdateManyWithoutCommentsNestedInputObjectSchema } from './comment_likesUpdateManyWithoutCommentsNestedInput.schema';
import { comment_mentionsUpdateManyWithoutCommentsNestedInputObjectSchema } from './comment_mentionsUpdateManyWithoutCommentsNestedInput.schema';
import { commentsUpdateOneWithoutOther_commentsNestedInputObjectSchema } from './commentsUpdateOneWithoutOther_commentsNestedInput.schema';
import { commentsUpdateManyWithoutCommentsNestedInputObjectSchema } from './commentsUpdateManyWithoutCommentsNestedInput.schema';
import { comment_threadsUpdateOneRequiredWithoutCommentsNestedInputObjectSchema } from './comment_threadsUpdateOneRequiredWithoutCommentsNestedInput.schema'

export const commentsUpdateInputObjectSchema: z.ZodType<Prisma.commentsUpdateInput, Prisma.commentsUpdateInput> = z.object({
  author_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  content: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  resolved: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  comment_likes: z.lazy(() => comment_likesUpdateManyWithoutCommentsNestedInputObjectSchema).optional(),
  comment_mentions: z.lazy(() => comment_mentionsUpdateManyWithoutCommentsNestedInputObjectSchema).optional(),
  comments: z.lazy(() => commentsUpdateOneWithoutOther_commentsNestedInputObjectSchema).optional(),
  other_comments: z.lazy(() => commentsUpdateManyWithoutCommentsNestedInputObjectSchema).optional(),
  comment_threads: z.lazy(() => comment_threadsUpdateOneRequiredWithoutCommentsNestedInputObjectSchema).optional()
}).strict();
export const commentsUpdateInputObjectZodSchema = z.object({
  author_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  content: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  resolved: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updated_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  comment_likes: z.lazy(() => comment_likesUpdateManyWithoutCommentsNestedInputObjectSchema).optional(),
  comment_mentions: z.lazy(() => comment_mentionsUpdateManyWithoutCommentsNestedInputObjectSchema).optional(),
  comments: z.lazy(() => commentsUpdateOneWithoutOther_commentsNestedInputObjectSchema).optional(),
  other_comments: z.lazy(() => commentsUpdateManyWithoutCommentsNestedInputObjectSchema).optional(),
  comment_threads: z.lazy(() => comment_threadsUpdateOneRequiredWithoutCommentsNestedInputObjectSchema).optional()
}).strict();
