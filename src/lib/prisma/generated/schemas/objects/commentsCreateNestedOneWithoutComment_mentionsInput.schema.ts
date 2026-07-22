// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsCreateWithoutComment_mentionsInputObjectSchema } from './commentsCreateWithoutComment_mentionsInput.schema';
import { commentsUncheckedCreateWithoutComment_mentionsInputObjectSchema } from './commentsUncheckedCreateWithoutComment_mentionsInput.schema';
import { commentsCreateOrConnectWithoutComment_mentionsInputObjectSchema } from './commentsCreateOrConnectWithoutComment_mentionsInput.schema';
import { commentsWhereUniqueInputObjectSchema } from './commentsWhereUniqueInput.schema'

export const commentsCreateNestedOneWithoutComment_mentionsInputObjectSchema: z.ZodType<Prisma.commentsCreateNestedOneWithoutComment_mentionsInput, Prisma.commentsCreateNestedOneWithoutComment_mentionsInput> = z.object({
  create: z.union([z.lazy(() => commentsCreateWithoutComment_mentionsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutComment_mentionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => commentsCreateOrConnectWithoutComment_mentionsInputObjectSchema).optional(),
  connect: z.lazy(() => commentsWhereUniqueInputObjectSchema).optional()
}).strict();
export const commentsCreateNestedOneWithoutComment_mentionsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => commentsCreateWithoutComment_mentionsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutComment_mentionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => commentsCreateOrConnectWithoutComment_mentionsInputObjectSchema).optional(),
  connect: z.lazy(() => commentsWhereUniqueInputObjectSchema).optional()
}).strict();
