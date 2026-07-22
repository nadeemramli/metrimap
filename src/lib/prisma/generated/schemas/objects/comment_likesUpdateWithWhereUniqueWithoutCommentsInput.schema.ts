// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_likesWhereUniqueInputObjectSchema } from './comment_likesWhereUniqueInput.schema';
import { comment_likesUpdateWithoutCommentsInputObjectSchema } from './comment_likesUpdateWithoutCommentsInput.schema';
import { comment_likesUncheckedUpdateWithoutCommentsInputObjectSchema } from './comment_likesUncheckedUpdateWithoutCommentsInput.schema'

export const comment_likesUpdateWithWhereUniqueWithoutCommentsInputObjectSchema: z.ZodType<Prisma.comment_likesUpdateWithWhereUniqueWithoutCommentsInput, Prisma.comment_likesUpdateWithWhereUniqueWithoutCommentsInput> = z.object({
  where: z.lazy(() => comment_likesWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => comment_likesUpdateWithoutCommentsInputObjectSchema), z.lazy(() => comment_likesUncheckedUpdateWithoutCommentsInputObjectSchema)])
}).strict();
export const comment_likesUpdateWithWhereUniqueWithoutCommentsInputObjectZodSchema = z.object({
  where: z.lazy(() => comment_likesWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => comment_likesUpdateWithoutCommentsInputObjectSchema), z.lazy(() => comment_likesUncheckedUpdateWithoutCommentsInputObjectSchema)])
}).strict();
