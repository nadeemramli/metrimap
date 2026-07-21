// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsCreateWithoutComment_likesInputObjectSchema } from './commentsCreateWithoutComment_likesInput.schema';
import { commentsUncheckedCreateWithoutComment_likesInputObjectSchema } from './commentsUncheckedCreateWithoutComment_likesInput.schema';
import { commentsCreateOrConnectWithoutComment_likesInputObjectSchema } from './commentsCreateOrConnectWithoutComment_likesInput.schema';
import { commentsWhereUniqueInputObjectSchema } from './commentsWhereUniqueInput.schema'

export const commentsCreateNestedOneWithoutComment_likesInputObjectSchema: z.ZodType<Prisma.commentsCreateNestedOneWithoutComment_likesInput, Prisma.commentsCreateNestedOneWithoutComment_likesInput> = z.object({
  create: z.union([z.lazy(() => commentsCreateWithoutComment_likesInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutComment_likesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => commentsCreateOrConnectWithoutComment_likesInputObjectSchema).optional(),
  connect: z.lazy(() => commentsWhereUniqueInputObjectSchema).optional()
}).strict();
export const commentsCreateNestedOneWithoutComment_likesInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => commentsCreateWithoutComment_likesInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutComment_likesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => commentsCreateOrConnectWithoutComment_likesInputObjectSchema).optional(),
  connect: z.lazy(() => commentsWhereUniqueInputObjectSchema).optional()
}).strict();
