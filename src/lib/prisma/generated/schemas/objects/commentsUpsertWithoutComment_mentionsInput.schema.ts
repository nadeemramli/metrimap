// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsUpdateWithoutComment_mentionsInputObjectSchema } from './commentsUpdateWithoutComment_mentionsInput.schema';
import { commentsUncheckedUpdateWithoutComment_mentionsInputObjectSchema } from './commentsUncheckedUpdateWithoutComment_mentionsInput.schema';
import { commentsCreateWithoutComment_mentionsInputObjectSchema } from './commentsCreateWithoutComment_mentionsInput.schema';
import { commentsUncheckedCreateWithoutComment_mentionsInputObjectSchema } from './commentsUncheckedCreateWithoutComment_mentionsInput.schema';
import { commentsWhereInputObjectSchema } from './commentsWhereInput.schema'

export const commentsUpsertWithoutComment_mentionsInputObjectSchema: z.ZodType<Prisma.commentsUpsertWithoutComment_mentionsInput, Prisma.commentsUpsertWithoutComment_mentionsInput> = z.object({
  update: z.union([z.lazy(() => commentsUpdateWithoutComment_mentionsInputObjectSchema), z.lazy(() => commentsUncheckedUpdateWithoutComment_mentionsInputObjectSchema)]),
  create: z.union([z.lazy(() => commentsCreateWithoutComment_mentionsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutComment_mentionsInputObjectSchema)]),
  where: z.lazy(() => commentsWhereInputObjectSchema).optional()
}).strict();
export const commentsUpsertWithoutComment_mentionsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => commentsUpdateWithoutComment_mentionsInputObjectSchema), z.lazy(() => commentsUncheckedUpdateWithoutComment_mentionsInputObjectSchema)]),
  create: z.union([z.lazy(() => commentsCreateWithoutComment_mentionsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutComment_mentionsInputObjectSchema)]),
  where: z.lazy(() => commentsWhereInputObjectSchema).optional()
}).strict();
