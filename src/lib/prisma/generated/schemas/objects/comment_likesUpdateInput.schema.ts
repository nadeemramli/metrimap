// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { commentsUpdateOneRequiredWithoutComment_likesNestedInputObjectSchema } from './commentsUpdateOneRequiredWithoutComment_likesNestedInput.schema'

export const comment_likesUpdateInputObjectSchema: z.ZodType<Prisma.comment_likesUpdateInput, Prisma.comment_likesUpdateInput> = z.object({
  user_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  comments: z.lazy(() => commentsUpdateOneRequiredWithoutComment_likesNestedInputObjectSchema).optional()
}).strict();
export const comment_likesUpdateInputObjectZodSchema = z.object({
  user_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  created_at: z.union([z.union([z.date(), z.string().datetime()]), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  comments: z.lazy(() => commentsUpdateOneRequiredWithoutComment_likesNestedInputObjectSchema).optional()
}).strict();
