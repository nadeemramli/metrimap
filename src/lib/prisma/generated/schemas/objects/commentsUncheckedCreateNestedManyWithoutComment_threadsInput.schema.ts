// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsCreateWithoutComment_threadsInputObjectSchema } from './commentsCreateWithoutComment_threadsInput.schema';
import { commentsUncheckedCreateWithoutComment_threadsInputObjectSchema } from './commentsUncheckedCreateWithoutComment_threadsInput.schema';
import { commentsCreateOrConnectWithoutComment_threadsInputObjectSchema } from './commentsCreateOrConnectWithoutComment_threadsInput.schema';
import { commentsCreateManyComment_threadsInputEnvelopeObjectSchema } from './commentsCreateManyComment_threadsInputEnvelope.schema';
import { commentsWhereUniqueInputObjectSchema } from './commentsWhereUniqueInput.schema'

export const commentsUncheckedCreateNestedManyWithoutComment_threadsInputObjectSchema: z.ZodType<Prisma.commentsUncheckedCreateNestedManyWithoutComment_threadsInput, Prisma.commentsUncheckedCreateNestedManyWithoutComment_threadsInput> = z.object({
  create: z.union([z.lazy(() => commentsCreateWithoutComment_threadsInputObjectSchema), z.lazy(() => commentsCreateWithoutComment_threadsInputObjectSchema).array(), z.lazy(() => commentsUncheckedCreateWithoutComment_threadsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutComment_threadsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => commentsCreateOrConnectWithoutComment_threadsInputObjectSchema), z.lazy(() => commentsCreateOrConnectWithoutComment_threadsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => commentsCreateManyComment_threadsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => commentsWhereUniqueInputObjectSchema), z.lazy(() => commentsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const commentsUncheckedCreateNestedManyWithoutComment_threadsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => commentsCreateWithoutComment_threadsInputObjectSchema), z.lazy(() => commentsCreateWithoutComment_threadsInputObjectSchema).array(), z.lazy(() => commentsUncheckedCreateWithoutComment_threadsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutComment_threadsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => commentsCreateOrConnectWithoutComment_threadsInputObjectSchema), z.lazy(() => commentsCreateOrConnectWithoutComment_threadsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => commentsCreateManyComment_threadsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => commentsWhereUniqueInputObjectSchema), z.lazy(() => commentsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
