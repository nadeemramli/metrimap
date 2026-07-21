// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsCreateWithoutCommentsInputObjectSchema } from './commentsCreateWithoutCommentsInput.schema';
import { commentsUncheckedCreateWithoutCommentsInputObjectSchema } from './commentsUncheckedCreateWithoutCommentsInput.schema';
import { commentsCreateOrConnectWithoutCommentsInputObjectSchema } from './commentsCreateOrConnectWithoutCommentsInput.schema';
import { commentsCreateManyCommentsInputEnvelopeObjectSchema } from './commentsCreateManyCommentsInputEnvelope.schema';
import { commentsWhereUniqueInputObjectSchema } from './commentsWhereUniqueInput.schema'

export const commentsCreateNestedManyWithoutCommentsInputObjectSchema: z.ZodType<Prisma.commentsCreateNestedManyWithoutCommentsInput, Prisma.commentsCreateNestedManyWithoutCommentsInput> = z.object({
  create: z.union([z.lazy(() => commentsCreateWithoutCommentsInputObjectSchema), z.lazy(() => commentsCreateWithoutCommentsInputObjectSchema).array(), z.lazy(() => commentsUncheckedCreateWithoutCommentsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutCommentsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => commentsCreateOrConnectWithoutCommentsInputObjectSchema), z.lazy(() => commentsCreateOrConnectWithoutCommentsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => commentsCreateManyCommentsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => commentsWhereUniqueInputObjectSchema), z.lazy(() => commentsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const commentsCreateNestedManyWithoutCommentsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => commentsCreateWithoutCommentsInputObjectSchema), z.lazy(() => commentsCreateWithoutCommentsInputObjectSchema).array(), z.lazy(() => commentsUncheckedCreateWithoutCommentsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutCommentsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => commentsCreateOrConnectWithoutCommentsInputObjectSchema), z.lazy(() => commentsCreateOrConnectWithoutCommentsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => commentsCreateManyCommentsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => commentsWhereUniqueInputObjectSchema), z.lazy(() => commentsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
