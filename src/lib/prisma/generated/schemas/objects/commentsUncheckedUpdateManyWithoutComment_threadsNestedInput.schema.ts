// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsCreateWithoutComment_threadsInputObjectSchema } from './commentsCreateWithoutComment_threadsInput.schema';
import { commentsUncheckedCreateWithoutComment_threadsInputObjectSchema } from './commentsUncheckedCreateWithoutComment_threadsInput.schema';
import { commentsCreateOrConnectWithoutComment_threadsInputObjectSchema } from './commentsCreateOrConnectWithoutComment_threadsInput.schema';
import { commentsUpsertWithWhereUniqueWithoutComment_threadsInputObjectSchema } from './commentsUpsertWithWhereUniqueWithoutComment_threadsInput.schema';
import { commentsCreateManyComment_threadsInputEnvelopeObjectSchema } from './commentsCreateManyComment_threadsInputEnvelope.schema';
import { commentsWhereUniqueInputObjectSchema } from './commentsWhereUniqueInput.schema';
import { commentsUpdateWithWhereUniqueWithoutComment_threadsInputObjectSchema } from './commentsUpdateWithWhereUniqueWithoutComment_threadsInput.schema';
import { commentsUpdateManyWithWhereWithoutComment_threadsInputObjectSchema } from './commentsUpdateManyWithWhereWithoutComment_threadsInput.schema';
import { commentsScalarWhereInputObjectSchema } from './commentsScalarWhereInput.schema'

export const commentsUncheckedUpdateManyWithoutComment_threadsNestedInputObjectSchema: z.ZodType<Prisma.commentsUncheckedUpdateManyWithoutComment_threadsNestedInput, Prisma.commentsUncheckedUpdateManyWithoutComment_threadsNestedInput> = z.object({
  create: z.union([z.lazy(() => commentsCreateWithoutComment_threadsInputObjectSchema), z.lazy(() => commentsCreateWithoutComment_threadsInputObjectSchema).array(), z.lazy(() => commentsUncheckedCreateWithoutComment_threadsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutComment_threadsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => commentsCreateOrConnectWithoutComment_threadsInputObjectSchema), z.lazy(() => commentsCreateOrConnectWithoutComment_threadsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => commentsUpsertWithWhereUniqueWithoutComment_threadsInputObjectSchema), z.lazy(() => commentsUpsertWithWhereUniqueWithoutComment_threadsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => commentsCreateManyComment_threadsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => commentsWhereUniqueInputObjectSchema), z.lazy(() => commentsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => commentsWhereUniqueInputObjectSchema), z.lazy(() => commentsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => commentsWhereUniqueInputObjectSchema), z.lazy(() => commentsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => commentsWhereUniqueInputObjectSchema), z.lazy(() => commentsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => commentsUpdateWithWhereUniqueWithoutComment_threadsInputObjectSchema), z.lazy(() => commentsUpdateWithWhereUniqueWithoutComment_threadsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => commentsUpdateManyWithWhereWithoutComment_threadsInputObjectSchema), z.lazy(() => commentsUpdateManyWithWhereWithoutComment_threadsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => commentsScalarWhereInputObjectSchema), z.lazy(() => commentsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const commentsUncheckedUpdateManyWithoutComment_threadsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => commentsCreateWithoutComment_threadsInputObjectSchema), z.lazy(() => commentsCreateWithoutComment_threadsInputObjectSchema).array(), z.lazy(() => commentsUncheckedCreateWithoutComment_threadsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutComment_threadsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => commentsCreateOrConnectWithoutComment_threadsInputObjectSchema), z.lazy(() => commentsCreateOrConnectWithoutComment_threadsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => commentsUpsertWithWhereUniqueWithoutComment_threadsInputObjectSchema), z.lazy(() => commentsUpsertWithWhereUniqueWithoutComment_threadsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => commentsCreateManyComment_threadsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => commentsWhereUniqueInputObjectSchema), z.lazy(() => commentsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => commentsWhereUniqueInputObjectSchema), z.lazy(() => commentsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => commentsWhereUniqueInputObjectSchema), z.lazy(() => commentsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => commentsWhereUniqueInputObjectSchema), z.lazy(() => commentsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => commentsUpdateWithWhereUniqueWithoutComment_threadsInputObjectSchema), z.lazy(() => commentsUpdateWithWhereUniqueWithoutComment_threadsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => commentsUpdateManyWithWhereWithoutComment_threadsInputObjectSchema), z.lazy(() => commentsUpdateManyWithWhereWithoutComment_threadsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => commentsScalarWhereInputObjectSchema), z.lazy(() => commentsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
