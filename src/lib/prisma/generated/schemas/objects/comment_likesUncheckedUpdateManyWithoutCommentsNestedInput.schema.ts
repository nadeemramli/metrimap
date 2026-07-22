// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_likesCreateWithoutCommentsInputObjectSchema } from './comment_likesCreateWithoutCommentsInput.schema';
import { comment_likesUncheckedCreateWithoutCommentsInputObjectSchema } from './comment_likesUncheckedCreateWithoutCommentsInput.schema';
import { comment_likesCreateOrConnectWithoutCommentsInputObjectSchema } from './comment_likesCreateOrConnectWithoutCommentsInput.schema';
import { comment_likesUpsertWithWhereUniqueWithoutCommentsInputObjectSchema } from './comment_likesUpsertWithWhereUniqueWithoutCommentsInput.schema';
import { comment_likesCreateManyCommentsInputEnvelopeObjectSchema } from './comment_likesCreateManyCommentsInputEnvelope.schema';
import { comment_likesWhereUniqueInputObjectSchema } from './comment_likesWhereUniqueInput.schema';
import { comment_likesUpdateWithWhereUniqueWithoutCommentsInputObjectSchema } from './comment_likesUpdateWithWhereUniqueWithoutCommentsInput.schema';
import { comment_likesUpdateManyWithWhereWithoutCommentsInputObjectSchema } from './comment_likesUpdateManyWithWhereWithoutCommentsInput.schema';
import { comment_likesScalarWhereInputObjectSchema } from './comment_likesScalarWhereInput.schema'

export const comment_likesUncheckedUpdateManyWithoutCommentsNestedInputObjectSchema: z.ZodType<Prisma.comment_likesUncheckedUpdateManyWithoutCommentsNestedInput, Prisma.comment_likesUncheckedUpdateManyWithoutCommentsNestedInput> = z.object({
  create: z.union([z.lazy(() => comment_likesCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_likesCreateWithoutCommentsInputObjectSchema).array(), z.lazy(() => comment_likesUncheckedCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_likesUncheckedCreateWithoutCommentsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => comment_likesCreateOrConnectWithoutCommentsInputObjectSchema), z.lazy(() => comment_likesCreateOrConnectWithoutCommentsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => comment_likesUpsertWithWhereUniqueWithoutCommentsInputObjectSchema), z.lazy(() => comment_likesUpsertWithWhereUniqueWithoutCommentsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => comment_likesCreateManyCommentsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => comment_likesWhereUniqueInputObjectSchema), z.lazy(() => comment_likesWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => comment_likesWhereUniqueInputObjectSchema), z.lazy(() => comment_likesWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => comment_likesWhereUniqueInputObjectSchema), z.lazy(() => comment_likesWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => comment_likesWhereUniqueInputObjectSchema), z.lazy(() => comment_likesWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => comment_likesUpdateWithWhereUniqueWithoutCommentsInputObjectSchema), z.lazy(() => comment_likesUpdateWithWhereUniqueWithoutCommentsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => comment_likesUpdateManyWithWhereWithoutCommentsInputObjectSchema), z.lazy(() => comment_likesUpdateManyWithWhereWithoutCommentsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => comment_likesScalarWhereInputObjectSchema), z.lazy(() => comment_likesScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const comment_likesUncheckedUpdateManyWithoutCommentsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => comment_likesCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_likesCreateWithoutCommentsInputObjectSchema).array(), z.lazy(() => comment_likesUncheckedCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_likesUncheckedCreateWithoutCommentsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => comment_likesCreateOrConnectWithoutCommentsInputObjectSchema), z.lazy(() => comment_likesCreateOrConnectWithoutCommentsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => comment_likesUpsertWithWhereUniqueWithoutCommentsInputObjectSchema), z.lazy(() => comment_likesUpsertWithWhereUniqueWithoutCommentsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => comment_likesCreateManyCommentsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => comment_likesWhereUniqueInputObjectSchema), z.lazy(() => comment_likesWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => comment_likesWhereUniqueInputObjectSchema), z.lazy(() => comment_likesWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => comment_likesWhereUniqueInputObjectSchema), z.lazy(() => comment_likesWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => comment_likesWhereUniqueInputObjectSchema), z.lazy(() => comment_likesWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => comment_likesUpdateWithWhereUniqueWithoutCommentsInputObjectSchema), z.lazy(() => comment_likesUpdateWithWhereUniqueWithoutCommentsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => comment_likesUpdateManyWithWhereWithoutCommentsInputObjectSchema), z.lazy(() => comment_likesUpdateManyWithWhereWithoutCommentsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => comment_likesScalarWhereInputObjectSchema), z.lazy(() => comment_likesScalarWhereInputObjectSchema).array()]).optional()
}).strict();
