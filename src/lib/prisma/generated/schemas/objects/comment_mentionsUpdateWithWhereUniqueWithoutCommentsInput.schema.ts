// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_mentionsWhereUniqueInputObjectSchema } from './comment_mentionsWhereUniqueInput.schema';
import { comment_mentionsUpdateWithoutCommentsInputObjectSchema } from './comment_mentionsUpdateWithoutCommentsInput.schema';
import { comment_mentionsUncheckedUpdateWithoutCommentsInputObjectSchema } from './comment_mentionsUncheckedUpdateWithoutCommentsInput.schema'

export const comment_mentionsUpdateWithWhereUniqueWithoutCommentsInputObjectSchema: z.ZodType<Prisma.comment_mentionsUpdateWithWhereUniqueWithoutCommentsInput, Prisma.comment_mentionsUpdateWithWhereUniqueWithoutCommentsInput> = z.object({
  where: z.lazy(() => comment_mentionsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => comment_mentionsUpdateWithoutCommentsInputObjectSchema), z.lazy(() => comment_mentionsUncheckedUpdateWithoutCommentsInputObjectSchema)])
}).strict();
export const comment_mentionsUpdateWithWhereUniqueWithoutCommentsInputObjectZodSchema = z.object({
  where: z.lazy(() => comment_mentionsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => comment_mentionsUpdateWithoutCommentsInputObjectSchema), z.lazy(() => comment_mentionsUncheckedUpdateWithoutCommentsInputObjectSchema)])
}).strict();
