// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsWhereUniqueInputObjectSchema } from './commentsWhereUniqueInput.schema';
import { commentsUpdateWithoutComment_threadsInputObjectSchema } from './commentsUpdateWithoutComment_threadsInput.schema';
import { commentsUncheckedUpdateWithoutComment_threadsInputObjectSchema } from './commentsUncheckedUpdateWithoutComment_threadsInput.schema'

export const commentsUpdateWithWhereUniqueWithoutComment_threadsInputObjectSchema: z.ZodType<Prisma.commentsUpdateWithWhereUniqueWithoutComment_threadsInput, Prisma.commentsUpdateWithWhereUniqueWithoutComment_threadsInput> = z.object({
  where: z.lazy(() => commentsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => commentsUpdateWithoutComment_threadsInputObjectSchema), z.lazy(() => commentsUncheckedUpdateWithoutComment_threadsInputObjectSchema)])
}).strict();
export const commentsUpdateWithWhereUniqueWithoutComment_threadsInputObjectZodSchema = z.object({
  where: z.lazy(() => commentsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => commentsUpdateWithoutComment_threadsInputObjectSchema), z.lazy(() => commentsUncheckedUpdateWithoutComment_threadsInputObjectSchema)])
}).strict();
