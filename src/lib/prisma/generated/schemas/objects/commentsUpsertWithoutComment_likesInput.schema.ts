// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsUpdateWithoutComment_likesInputObjectSchema } from './commentsUpdateWithoutComment_likesInput.schema';
import { commentsUncheckedUpdateWithoutComment_likesInputObjectSchema } from './commentsUncheckedUpdateWithoutComment_likesInput.schema';
import { commentsCreateWithoutComment_likesInputObjectSchema } from './commentsCreateWithoutComment_likesInput.schema';
import { commentsUncheckedCreateWithoutComment_likesInputObjectSchema } from './commentsUncheckedCreateWithoutComment_likesInput.schema';
import { commentsWhereInputObjectSchema } from './commentsWhereInput.schema'

export const commentsUpsertWithoutComment_likesInputObjectSchema: z.ZodType<Prisma.commentsUpsertWithoutComment_likesInput, Prisma.commentsUpsertWithoutComment_likesInput> = z.object({
  update: z.union([z.lazy(() => commentsUpdateWithoutComment_likesInputObjectSchema), z.lazy(() => commentsUncheckedUpdateWithoutComment_likesInputObjectSchema)]),
  create: z.union([z.lazy(() => commentsCreateWithoutComment_likesInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutComment_likesInputObjectSchema)]),
  where: z.lazy(() => commentsWhereInputObjectSchema).optional()
}).strict();
export const commentsUpsertWithoutComment_likesInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => commentsUpdateWithoutComment_likesInputObjectSchema), z.lazy(() => commentsUncheckedUpdateWithoutComment_likesInputObjectSchema)]),
  create: z.union([z.lazy(() => commentsCreateWithoutComment_likesInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutComment_likesInputObjectSchema)]),
  where: z.lazy(() => commentsWhereInputObjectSchema).optional()
}).strict();
