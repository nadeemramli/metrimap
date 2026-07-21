// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_likesWhereUniqueInputObjectSchema } from './comment_likesWhereUniqueInput.schema';
import { comment_likesUpdateWithoutCommentsInputObjectSchema } from './comment_likesUpdateWithoutCommentsInput.schema';
import { comment_likesUncheckedUpdateWithoutCommentsInputObjectSchema } from './comment_likesUncheckedUpdateWithoutCommentsInput.schema';
import { comment_likesCreateWithoutCommentsInputObjectSchema } from './comment_likesCreateWithoutCommentsInput.schema';
import { comment_likesUncheckedCreateWithoutCommentsInputObjectSchema } from './comment_likesUncheckedCreateWithoutCommentsInput.schema'

export const comment_likesUpsertWithWhereUniqueWithoutCommentsInputObjectSchema: z.ZodType<Prisma.comment_likesUpsertWithWhereUniqueWithoutCommentsInput, Prisma.comment_likesUpsertWithWhereUniqueWithoutCommentsInput> = z.object({
  where: z.lazy(() => comment_likesWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => comment_likesUpdateWithoutCommentsInputObjectSchema), z.lazy(() => comment_likesUncheckedUpdateWithoutCommentsInputObjectSchema)]),
  create: z.union([z.lazy(() => comment_likesCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_likesUncheckedCreateWithoutCommentsInputObjectSchema)])
}).strict();
export const comment_likesUpsertWithWhereUniqueWithoutCommentsInputObjectZodSchema = z.object({
  where: z.lazy(() => comment_likesWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => comment_likesUpdateWithoutCommentsInputObjectSchema), z.lazy(() => comment_likesUncheckedUpdateWithoutCommentsInputObjectSchema)]),
  create: z.union([z.lazy(() => comment_likesCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_likesUncheckedCreateWithoutCommentsInputObjectSchema)])
}).strict();
