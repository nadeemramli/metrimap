// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsCreateWithoutCommentsInputObjectSchema } from './commentsCreateWithoutCommentsInput.schema';
import { commentsUncheckedCreateWithoutCommentsInputObjectSchema } from './commentsUncheckedCreateWithoutCommentsInput.schema';
import { commentsCreateOrConnectWithoutCommentsInputObjectSchema } from './commentsCreateOrConnectWithoutCommentsInput.schema';
import { commentsUpsertWithWhereUniqueWithoutCommentsInputObjectSchema } from './commentsUpsertWithWhereUniqueWithoutCommentsInput.schema';
import { commentsCreateManyCommentsInputEnvelopeObjectSchema } from './commentsCreateManyCommentsInputEnvelope.schema';
import { commentsWhereUniqueInputObjectSchema } from './commentsWhereUniqueInput.schema';
import { commentsUpdateWithWhereUniqueWithoutCommentsInputObjectSchema } from './commentsUpdateWithWhereUniqueWithoutCommentsInput.schema';
import { commentsUpdateManyWithWhereWithoutCommentsInputObjectSchema } from './commentsUpdateManyWithWhereWithoutCommentsInput.schema';
import { commentsScalarWhereInputObjectSchema } from './commentsScalarWhereInput.schema'

export const commentsUpdateManyWithoutCommentsNestedInputObjectSchema: z.ZodType<Prisma.commentsUpdateManyWithoutCommentsNestedInput, Prisma.commentsUpdateManyWithoutCommentsNestedInput> = z.object({
  create: z.union([z.lazy(() => commentsCreateWithoutCommentsInputObjectSchema), z.lazy(() => commentsCreateWithoutCommentsInputObjectSchema).array(), z.lazy(() => commentsUncheckedCreateWithoutCommentsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutCommentsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => commentsCreateOrConnectWithoutCommentsInputObjectSchema), z.lazy(() => commentsCreateOrConnectWithoutCommentsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => commentsUpsertWithWhereUniqueWithoutCommentsInputObjectSchema), z.lazy(() => commentsUpsertWithWhereUniqueWithoutCommentsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => commentsCreateManyCommentsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => commentsWhereUniqueInputObjectSchema), z.lazy(() => commentsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => commentsWhereUniqueInputObjectSchema), z.lazy(() => commentsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => commentsWhereUniqueInputObjectSchema), z.lazy(() => commentsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => commentsWhereUniqueInputObjectSchema), z.lazy(() => commentsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => commentsUpdateWithWhereUniqueWithoutCommentsInputObjectSchema), z.lazy(() => commentsUpdateWithWhereUniqueWithoutCommentsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => commentsUpdateManyWithWhereWithoutCommentsInputObjectSchema), z.lazy(() => commentsUpdateManyWithWhereWithoutCommentsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => commentsScalarWhereInputObjectSchema), z.lazy(() => commentsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const commentsUpdateManyWithoutCommentsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => commentsCreateWithoutCommentsInputObjectSchema), z.lazy(() => commentsCreateWithoutCommentsInputObjectSchema).array(), z.lazy(() => commentsUncheckedCreateWithoutCommentsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutCommentsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => commentsCreateOrConnectWithoutCommentsInputObjectSchema), z.lazy(() => commentsCreateOrConnectWithoutCommentsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => commentsUpsertWithWhereUniqueWithoutCommentsInputObjectSchema), z.lazy(() => commentsUpsertWithWhereUniqueWithoutCommentsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => commentsCreateManyCommentsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => commentsWhereUniqueInputObjectSchema), z.lazy(() => commentsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => commentsWhereUniqueInputObjectSchema), z.lazy(() => commentsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => commentsWhereUniqueInputObjectSchema), z.lazy(() => commentsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => commentsWhereUniqueInputObjectSchema), z.lazy(() => commentsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => commentsUpdateWithWhereUniqueWithoutCommentsInputObjectSchema), z.lazy(() => commentsUpdateWithWhereUniqueWithoutCommentsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => commentsUpdateManyWithWhereWithoutCommentsInputObjectSchema), z.lazy(() => commentsUpdateManyWithWhereWithoutCommentsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => commentsScalarWhereInputObjectSchema), z.lazy(() => commentsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
