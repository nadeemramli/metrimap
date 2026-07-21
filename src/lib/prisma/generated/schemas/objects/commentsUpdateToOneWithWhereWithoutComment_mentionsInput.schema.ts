// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsWhereInputObjectSchema } from './commentsWhereInput.schema';
import { commentsUpdateWithoutComment_mentionsInputObjectSchema } from './commentsUpdateWithoutComment_mentionsInput.schema';
import { commentsUncheckedUpdateWithoutComment_mentionsInputObjectSchema } from './commentsUncheckedUpdateWithoutComment_mentionsInput.schema'

export const commentsUpdateToOneWithWhereWithoutComment_mentionsInputObjectSchema: z.ZodType<Prisma.commentsUpdateToOneWithWhereWithoutComment_mentionsInput, Prisma.commentsUpdateToOneWithWhereWithoutComment_mentionsInput> = z.object({
  where: z.lazy(() => commentsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => commentsUpdateWithoutComment_mentionsInputObjectSchema), z.lazy(() => commentsUncheckedUpdateWithoutComment_mentionsInputObjectSchema)])
}).strict();
export const commentsUpdateToOneWithWhereWithoutComment_mentionsInputObjectZodSchema = z.object({
  where: z.lazy(() => commentsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => commentsUpdateWithoutComment_mentionsInputObjectSchema), z.lazy(() => commentsUncheckedUpdateWithoutComment_mentionsInputObjectSchema)])
}).strict();
