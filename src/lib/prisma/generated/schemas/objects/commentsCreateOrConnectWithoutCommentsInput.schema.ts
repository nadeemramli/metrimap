// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsWhereUniqueInputObjectSchema } from './commentsWhereUniqueInput.schema';
import { commentsCreateWithoutCommentsInputObjectSchema } from './commentsCreateWithoutCommentsInput.schema';
import { commentsUncheckedCreateWithoutCommentsInputObjectSchema } from './commentsUncheckedCreateWithoutCommentsInput.schema'

export const commentsCreateOrConnectWithoutCommentsInputObjectSchema: z.ZodType<Prisma.commentsCreateOrConnectWithoutCommentsInput, Prisma.commentsCreateOrConnectWithoutCommentsInput> = z.object({
  where: z.lazy(() => commentsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => commentsCreateWithoutCommentsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutCommentsInputObjectSchema)])
}).strict();
export const commentsCreateOrConnectWithoutCommentsInputObjectZodSchema = z.object({
  where: z.lazy(() => commentsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => commentsCreateWithoutCommentsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutCommentsInputObjectSchema)])
}).strict();
