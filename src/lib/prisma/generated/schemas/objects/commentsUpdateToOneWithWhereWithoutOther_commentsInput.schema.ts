// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsWhereInputObjectSchema } from './commentsWhereInput.schema';
import { commentsUpdateWithoutOther_commentsInputObjectSchema } from './commentsUpdateWithoutOther_commentsInput.schema';
import { commentsUncheckedUpdateWithoutOther_commentsInputObjectSchema } from './commentsUncheckedUpdateWithoutOther_commentsInput.schema'

export const commentsUpdateToOneWithWhereWithoutOther_commentsInputObjectSchema: z.ZodType<Prisma.commentsUpdateToOneWithWhereWithoutOther_commentsInput, Prisma.commentsUpdateToOneWithWhereWithoutOther_commentsInput> = z.object({
  where: z.lazy(() => commentsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => commentsUpdateWithoutOther_commentsInputObjectSchema), z.lazy(() => commentsUncheckedUpdateWithoutOther_commentsInputObjectSchema)])
}).strict();
export const commentsUpdateToOneWithWhereWithoutOther_commentsInputObjectZodSchema = z.object({
  where: z.lazy(() => commentsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => commentsUpdateWithoutOther_commentsInputObjectSchema), z.lazy(() => commentsUncheckedUpdateWithoutOther_commentsInputObjectSchema)])
}).strict();
