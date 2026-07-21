// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_mentionsCreateWithoutCommentsInputObjectSchema } from './comment_mentionsCreateWithoutCommentsInput.schema';
import { comment_mentionsUncheckedCreateWithoutCommentsInputObjectSchema } from './comment_mentionsUncheckedCreateWithoutCommentsInput.schema';
import { comment_mentionsCreateOrConnectWithoutCommentsInputObjectSchema } from './comment_mentionsCreateOrConnectWithoutCommentsInput.schema';
import { comment_mentionsUpsertWithWhereUniqueWithoutCommentsInputObjectSchema } from './comment_mentionsUpsertWithWhereUniqueWithoutCommentsInput.schema';
import { comment_mentionsCreateManyCommentsInputEnvelopeObjectSchema } from './comment_mentionsCreateManyCommentsInputEnvelope.schema';
import { comment_mentionsWhereUniqueInputObjectSchema } from './comment_mentionsWhereUniqueInput.schema';
import { comment_mentionsUpdateWithWhereUniqueWithoutCommentsInputObjectSchema } from './comment_mentionsUpdateWithWhereUniqueWithoutCommentsInput.schema';
import { comment_mentionsUpdateManyWithWhereWithoutCommentsInputObjectSchema } from './comment_mentionsUpdateManyWithWhereWithoutCommentsInput.schema';
import { comment_mentionsScalarWhereInputObjectSchema } from './comment_mentionsScalarWhereInput.schema'

export const comment_mentionsUpdateManyWithoutCommentsNestedInputObjectSchema: z.ZodType<Prisma.comment_mentionsUpdateManyWithoutCommentsNestedInput, Prisma.comment_mentionsUpdateManyWithoutCommentsNestedInput> = z.object({
  create: z.union([z.lazy(() => comment_mentionsCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_mentionsCreateWithoutCommentsInputObjectSchema).array(), z.lazy(() => comment_mentionsUncheckedCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_mentionsUncheckedCreateWithoutCommentsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => comment_mentionsCreateOrConnectWithoutCommentsInputObjectSchema), z.lazy(() => comment_mentionsCreateOrConnectWithoutCommentsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => comment_mentionsUpsertWithWhereUniqueWithoutCommentsInputObjectSchema), z.lazy(() => comment_mentionsUpsertWithWhereUniqueWithoutCommentsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => comment_mentionsCreateManyCommentsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => comment_mentionsWhereUniqueInputObjectSchema), z.lazy(() => comment_mentionsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => comment_mentionsWhereUniqueInputObjectSchema), z.lazy(() => comment_mentionsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => comment_mentionsWhereUniqueInputObjectSchema), z.lazy(() => comment_mentionsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => comment_mentionsWhereUniqueInputObjectSchema), z.lazy(() => comment_mentionsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => comment_mentionsUpdateWithWhereUniqueWithoutCommentsInputObjectSchema), z.lazy(() => comment_mentionsUpdateWithWhereUniqueWithoutCommentsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => comment_mentionsUpdateManyWithWhereWithoutCommentsInputObjectSchema), z.lazy(() => comment_mentionsUpdateManyWithWhereWithoutCommentsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => comment_mentionsScalarWhereInputObjectSchema), z.lazy(() => comment_mentionsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const comment_mentionsUpdateManyWithoutCommentsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => comment_mentionsCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_mentionsCreateWithoutCommentsInputObjectSchema).array(), z.lazy(() => comment_mentionsUncheckedCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_mentionsUncheckedCreateWithoutCommentsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => comment_mentionsCreateOrConnectWithoutCommentsInputObjectSchema), z.lazy(() => comment_mentionsCreateOrConnectWithoutCommentsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => comment_mentionsUpsertWithWhereUniqueWithoutCommentsInputObjectSchema), z.lazy(() => comment_mentionsUpsertWithWhereUniqueWithoutCommentsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => comment_mentionsCreateManyCommentsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => comment_mentionsWhereUniqueInputObjectSchema), z.lazy(() => comment_mentionsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => comment_mentionsWhereUniqueInputObjectSchema), z.lazy(() => comment_mentionsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => comment_mentionsWhereUniqueInputObjectSchema), z.lazy(() => comment_mentionsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => comment_mentionsWhereUniqueInputObjectSchema), z.lazy(() => comment_mentionsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => comment_mentionsUpdateWithWhereUniqueWithoutCommentsInputObjectSchema), z.lazy(() => comment_mentionsUpdateWithWhereUniqueWithoutCommentsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => comment_mentionsUpdateManyWithWhereWithoutCommentsInputObjectSchema), z.lazy(() => comment_mentionsUpdateManyWithWhereWithoutCommentsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => comment_mentionsScalarWhereInputObjectSchema), z.lazy(() => comment_mentionsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
