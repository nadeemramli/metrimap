// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsWhereUniqueInputObjectSchema } from './commentsWhereUniqueInput.schema';
import { commentsCreateWithoutOther_commentsInputObjectSchema } from './commentsCreateWithoutOther_commentsInput.schema';
import { commentsUncheckedCreateWithoutOther_commentsInputObjectSchema } from './commentsUncheckedCreateWithoutOther_commentsInput.schema'

export const commentsCreateOrConnectWithoutOther_commentsInputObjectSchema: z.ZodType<Prisma.commentsCreateOrConnectWithoutOther_commentsInput, Prisma.commentsCreateOrConnectWithoutOther_commentsInput> = z.object({
  where: z.lazy(() => commentsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => commentsCreateWithoutOther_commentsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutOther_commentsInputObjectSchema)])
}).strict();
export const commentsCreateOrConnectWithoutOther_commentsInputObjectZodSchema = z.object({
  where: z.lazy(() => commentsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => commentsCreateWithoutOther_commentsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutOther_commentsInputObjectSchema)])
}).strict();
