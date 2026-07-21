// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_likesCreateWithoutCommentsInputObjectSchema } from './comment_likesCreateWithoutCommentsInput.schema';
import { comment_likesUncheckedCreateWithoutCommentsInputObjectSchema } from './comment_likesUncheckedCreateWithoutCommentsInput.schema';
import { comment_likesCreateOrConnectWithoutCommentsInputObjectSchema } from './comment_likesCreateOrConnectWithoutCommentsInput.schema';
import { comment_likesCreateManyCommentsInputEnvelopeObjectSchema } from './comment_likesCreateManyCommentsInputEnvelope.schema';
import { comment_likesWhereUniqueInputObjectSchema } from './comment_likesWhereUniqueInput.schema'

export const comment_likesUncheckedCreateNestedManyWithoutCommentsInputObjectSchema: z.ZodType<Prisma.comment_likesUncheckedCreateNestedManyWithoutCommentsInput, Prisma.comment_likesUncheckedCreateNestedManyWithoutCommentsInput> = z.object({
  create: z.union([z.lazy(() => comment_likesCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_likesCreateWithoutCommentsInputObjectSchema).array(), z.lazy(() => comment_likesUncheckedCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_likesUncheckedCreateWithoutCommentsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => comment_likesCreateOrConnectWithoutCommentsInputObjectSchema), z.lazy(() => comment_likesCreateOrConnectWithoutCommentsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => comment_likesCreateManyCommentsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => comment_likesWhereUniqueInputObjectSchema), z.lazy(() => comment_likesWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const comment_likesUncheckedCreateNestedManyWithoutCommentsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => comment_likesCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_likesCreateWithoutCommentsInputObjectSchema).array(), z.lazy(() => comment_likesUncheckedCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_likesUncheckedCreateWithoutCommentsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => comment_likesCreateOrConnectWithoutCommentsInputObjectSchema), z.lazy(() => comment_likesCreateOrConnectWithoutCommentsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => comment_likesCreateManyCommentsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => comment_likesWhereUniqueInputObjectSchema), z.lazy(() => comment_likesWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
