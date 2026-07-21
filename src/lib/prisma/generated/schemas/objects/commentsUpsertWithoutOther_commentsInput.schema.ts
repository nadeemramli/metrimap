// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsUpdateWithoutOther_commentsInputObjectSchema } from './commentsUpdateWithoutOther_commentsInput.schema';
import { commentsUncheckedUpdateWithoutOther_commentsInputObjectSchema } from './commentsUncheckedUpdateWithoutOther_commentsInput.schema';
import { commentsCreateWithoutOther_commentsInputObjectSchema } from './commentsCreateWithoutOther_commentsInput.schema';
import { commentsUncheckedCreateWithoutOther_commentsInputObjectSchema } from './commentsUncheckedCreateWithoutOther_commentsInput.schema';
import { commentsWhereInputObjectSchema } from './commentsWhereInput.schema'

export const commentsUpsertWithoutOther_commentsInputObjectSchema: z.ZodType<Prisma.commentsUpsertWithoutOther_commentsInput, Prisma.commentsUpsertWithoutOther_commentsInput> = z.object({
  update: z.union([z.lazy(() => commentsUpdateWithoutOther_commentsInputObjectSchema), z.lazy(() => commentsUncheckedUpdateWithoutOther_commentsInputObjectSchema)]),
  create: z.union([z.lazy(() => commentsCreateWithoutOther_commentsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutOther_commentsInputObjectSchema)]),
  where: z.lazy(() => commentsWhereInputObjectSchema).optional()
}).strict();
export const commentsUpsertWithoutOther_commentsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => commentsUpdateWithoutOther_commentsInputObjectSchema), z.lazy(() => commentsUncheckedUpdateWithoutOther_commentsInputObjectSchema)]),
  create: z.union([z.lazy(() => commentsCreateWithoutOther_commentsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutOther_commentsInputObjectSchema)]),
  where: z.lazy(() => commentsWhereInputObjectSchema).optional()
}).strict();
