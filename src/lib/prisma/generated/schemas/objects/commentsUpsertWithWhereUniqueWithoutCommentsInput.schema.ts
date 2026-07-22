// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsWhereUniqueInputObjectSchema } from './commentsWhereUniqueInput.schema';
import { commentsUpdateWithoutCommentsInputObjectSchema } from './commentsUpdateWithoutCommentsInput.schema';
import { commentsUncheckedUpdateWithoutCommentsInputObjectSchema } from './commentsUncheckedUpdateWithoutCommentsInput.schema';
import { commentsCreateWithoutCommentsInputObjectSchema } from './commentsCreateWithoutCommentsInput.schema';
import { commentsUncheckedCreateWithoutCommentsInputObjectSchema } from './commentsUncheckedCreateWithoutCommentsInput.schema'

export const commentsUpsertWithWhereUniqueWithoutCommentsInputObjectSchema: z.ZodType<Prisma.commentsUpsertWithWhereUniqueWithoutCommentsInput, Prisma.commentsUpsertWithWhereUniqueWithoutCommentsInput> = z.object({
  where: z.lazy(() => commentsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => commentsUpdateWithoutCommentsInputObjectSchema), z.lazy(() => commentsUncheckedUpdateWithoutCommentsInputObjectSchema)]),
  create: z.union([z.lazy(() => commentsCreateWithoutCommentsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutCommentsInputObjectSchema)])
}).strict();
export const commentsUpsertWithWhereUniqueWithoutCommentsInputObjectZodSchema = z.object({
  where: z.lazy(() => commentsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => commentsUpdateWithoutCommentsInputObjectSchema), z.lazy(() => commentsUncheckedUpdateWithoutCommentsInputObjectSchema)]),
  create: z.union([z.lazy(() => commentsCreateWithoutCommentsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutCommentsInputObjectSchema)])
}).strict();
