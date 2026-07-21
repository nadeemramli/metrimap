// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsWhereUniqueInputObjectSchema } from './commentsWhereUniqueInput.schema';
import { commentsCreateWithoutComment_likesInputObjectSchema } from './commentsCreateWithoutComment_likesInput.schema';
import { commentsUncheckedCreateWithoutComment_likesInputObjectSchema } from './commentsUncheckedCreateWithoutComment_likesInput.schema'

export const commentsCreateOrConnectWithoutComment_likesInputObjectSchema: z.ZodType<Prisma.commentsCreateOrConnectWithoutComment_likesInput, Prisma.commentsCreateOrConnectWithoutComment_likesInput> = z.object({
  where: z.lazy(() => commentsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => commentsCreateWithoutComment_likesInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutComment_likesInputObjectSchema)])
}).strict();
export const commentsCreateOrConnectWithoutComment_likesInputObjectZodSchema = z.object({
  where: z.lazy(() => commentsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => commentsCreateWithoutComment_likesInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutComment_likesInputObjectSchema)])
}).strict();
