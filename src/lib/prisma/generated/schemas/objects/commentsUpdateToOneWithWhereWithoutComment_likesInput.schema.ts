// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsWhereInputObjectSchema } from './commentsWhereInput.schema';
import { commentsUpdateWithoutComment_likesInputObjectSchema } from './commentsUpdateWithoutComment_likesInput.schema';
import { commentsUncheckedUpdateWithoutComment_likesInputObjectSchema } from './commentsUncheckedUpdateWithoutComment_likesInput.schema'

export const commentsUpdateToOneWithWhereWithoutComment_likesInputObjectSchema: z.ZodType<Prisma.commentsUpdateToOneWithWhereWithoutComment_likesInput, Prisma.commentsUpdateToOneWithWhereWithoutComment_likesInput> = z.object({
  where: z.lazy(() => commentsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => commentsUpdateWithoutComment_likesInputObjectSchema), z.lazy(() => commentsUncheckedUpdateWithoutComment_likesInputObjectSchema)])
}).strict();
export const commentsUpdateToOneWithWhereWithoutComment_likesInputObjectZodSchema = z.object({
  where: z.lazy(() => commentsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => commentsUpdateWithoutComment_likesInputObjectSchema), z.lazy(() => commentsUncheckedUpdateWithoutComment_likesInputObjectSchema)])
}).strict();
