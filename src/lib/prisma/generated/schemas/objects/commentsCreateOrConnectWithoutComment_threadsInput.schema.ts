// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsWhereUniqueInputObjectSchema } from './commentsWhereUniqueInput.schema';
import { commentsCreateWithoutComment_threadsInputObjectSchema } from './commentsCreateWithoutComment_threadsInput.schema';
import { commentsUncheckedCreateWithoutComment_threadsInputObjectSchema } from './commentsUncheckedCreateWithoutComment_threadsInput.schema'

export const commentsCreateOrConnectWithoutComment_threadsInputObjectSchema: z.ZodType<Prisma.commentsCreateOrConnectWithoutComment_threadsInput, Prisma.commentsCreateOrConnectWithoutComment_threadsInput> = z.object({
  where: z.lazy(() => commentsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => commentsCreateWithoutComment_threadsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutComment_threadsInputObjectSchema)])
}).strict();
export const commentsCreateOrConnectWithoutComment_threadsInputObjectZodSchema = z.object({
  where: z.lazy(() => commentsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => commentsCreateWithoutComment_threadsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutComment_threadsInputObjectSchema)])
}).strict();
