// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsWhereUniqueInputObjectSchema } from './commentsWhereUniqueInput.schema';
import { commentsUpdateWithoutComment_threadsInputObjectSchema } from './commentsUpdateWithoutComment_threadsInput.schema';
import { commentsUncheckedUpdateWithoutComment_threadsInputObjectSchema } from './commentsUncheckedUpdateWithoutComment_threadsInput.schema';
import { commentsCreateWithoutComment_threadsInputObjectSchema } from './commentsCreateWithoutComment_threadsInput.schema';
import { commentsUncheckedCreateWithoutComment_threadsInputObjectSchema } from './commentsUncheckedCreateWithoutComment_threadsInput.schema'

export const commentsUpsertWithWhereUniqueWithoutComment_threadsInputObjectSchema: z.ZodType<Prisma.commentsUpsertWithWhereUniqueWithoutComment_threadsInput, Prisma.commentsUpsertWithWhereUniqueWithoutComment_threadsInput> = z.object({
  where: z.lazy(() => commentsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => commentsUpdateWithoutComment_threadsInputObjectSchema), z.lazy(() => commentsUncheckedUpdateWithoutComment_threadsInputObjectSchema)]),
  create: z.union([z.lazy(() => commentsCreateWithoutComment_threadsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutComment_threadsInputObjectSchema)])
}).strict();
export const commentsUpsertWithWhereUniqueWithoutComment_threadsInputObjectZodSchema = z.object({
  where: z.lazy(() => commentsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => commentsUpdateWithoutComment_threadsInputObjectSchema), z.lazy(() => commentsUncheckedUpdateWithoutComment_threadsInputObjectSchema)]),
  create: z.union([z.lazy(() => commentsCreateWithoutComment_threadsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutComment_threadsInputObjectSchema)])
}).strict();
