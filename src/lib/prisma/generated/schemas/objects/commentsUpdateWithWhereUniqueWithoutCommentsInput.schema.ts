// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsWhereUniqueInputObjectSchema } from './commentsWhereUniqueInput.schema';
import { commentsUpdateWithoutCommentsInputObjectSchema } from './commentsUpdateWithoutCommentsInput.schema';
import { commentsUncheckedUpdateWithoutCommentsInputObjectSchema } from './commentsUncheckedUpdateWithoutCommentsInput.schema'

export const commentsUpdateWithWhereUniqueWithoutCommentsInputObjectSchema: z.ZodType<Prisma.commentsUpdateWithWhereUniqueWithoutCommentsInput, Prisma.commentsUpdateWithWhereUniqueWithoutCommentsInput> = z.object({
  where: z.lazy(() => commentsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => commentsUpdateWithoutCommentsInputObjectSchema), z.lazy(() => commentsUncheckedUpdateWithoutCommentsInputObjectSchema)])
}).strict();
export const commentsUpdateWithWhereUniqueWithoutCommentsInputObjectZodSchema = z.object({
  where: z.lazy(() => commentsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => commentsUpdateWithoutCommentsInputObjectSchema), z.lazy(() => commentsUncheckedUpdateWithoutCommentsInputObjectSchema)])
}).strict();
