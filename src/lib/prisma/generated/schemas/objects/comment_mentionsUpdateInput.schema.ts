// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { commentsUpdateOneRequiredWithoutComment_mentionsNestedInputObjectSchema } from './commentsUpdateOneRequiredWithoutComment_mentionsNestedInput.schema'

export const comment_mentionsUpdateInputObjectSchema: z.ZodType<Prisma.comment_mentionsUpdateInput, Prisma.comment_mentionsUpdateInput> = z.object({
  mentioned_user_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  comments: z.lazy(() => commentsUpdateOneRequiredWithoutComment_mentionsNestedInputObjectSchema).optional()
}).strict();
export const comment_mentionsUpdateInputObjectZodSchema = z.object({
  mentioned_user_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  comments: z.lazy(() => commentsUpdateOneRequiredWithoutComment_mentionsNestedInputObjectSchema).optional()
}).strict();
