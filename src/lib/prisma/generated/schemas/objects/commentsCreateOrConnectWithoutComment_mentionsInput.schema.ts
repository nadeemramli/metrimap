// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsWhereUniqueInputObjectSchema } from './commentsWhereUniqueInput.schema';
import { commentsCreateWithoutComment_mentionsInputObjectSchema } from './commentsCreateWithoutComment_mentionsInput.schema';
import { commentsUncheckedCreateWithoutComment_mentionsInputObjectSchema } from './commentsUncheckedCreateWithoutComment_mentionsInput.schema'

export const commentsCreateOrConnectWithoutComment_mentionsInputObjectSchema: z.ZodType<Prisma.commentsCreateOrConnectWithoutComment_mentionsInput, Prisma.commentsCreateOrConnectWithoutComment_mentionsInput> = z.object({
  where: z.lazy(() => commentsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => commentsCreateWithoutComment_mentionsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutComment_mentionsInputObjectSchema)])
}).strict();
export const commentsCreateOrConnectWithoutComment_mentionsInputObjectZodSchema = z.object({
  where: z.lazy(() => commentsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => commentsCreateWithoutComment_mentionsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutComment_mentionsInputObjectSchema)])
}).strict();
