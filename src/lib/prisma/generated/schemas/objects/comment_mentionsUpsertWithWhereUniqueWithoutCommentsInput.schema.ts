// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_mentionsWhereUniqueInputObjectSchema } from './comment_mentionsWhereUniqueInput.schema';
import { comment_mentionsUpdateWithoutCommentsInputObjectSchema } from './comment_mentionsUpdateWithoutCommentsInput.schema';
import { comment_mentionsUncheckedUpdateWithoutCommentsInputObjectSchema } from './comment_mentionsUncheckedUpdateWithoutCommentsInput.schema';
import { comment_mentionsCreateWithoutCommentsInputObjectSchema } from './comment_mentionsCreateWithoutCommentsInput.schema';
import { comment_mentionsUncheckedCreateWithoutCommentsInputObjectSchema } from './comment_mentionsUncheckedCreateWithoutCommentsInput.schema'

export const comment_mentionsUpsertWithWhereUniqueWithoutCommentsInputObjectSchema: z.ZodType<Prisma.comment_mentionsUpsertWithWhereUniqueWithoutCommentsInput, Prisma.comment_mentionsUpsertWithWhereUniqueWithoutCommentsInput> = z.object({
  where: z.lazy(() => comment_mentionsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => comment_mentionsUpdateWithoutCommentsInputObjectSchema), z.lazy(() => comment_mentionsUncheckedUpdateWithoutCommentsInputObjectSchema)]),
  create: z.union([z.lazy(() => comment_mentionsCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_mentionsUncheckedCreateWithoutCommentsInputObjectSchema)])
}).strict();
export const comment_mentionsUpsertWithWhereUniqueWithoutCommentsInputObjectZodSchema = z.object({
  where: z.lazy(() => comment_mentionsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => comment_mentionsUpdateWithoutCommentsInputObjectSchema), z.lazy(() => comment_mentionsUncheckedUpdateWithoutCommentsInputObjectSchema)]),
  create: z.union([z.lazy(() => comment_mentionsCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_mentionsUncheckedCreateWithoutCommentsInputObjectSchema)])
}).strict();
