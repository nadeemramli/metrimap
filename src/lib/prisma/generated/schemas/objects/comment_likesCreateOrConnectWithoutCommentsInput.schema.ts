// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_likesWhereUniqueInputObjectSchema } from './comment_likesWhereUniqueInput.schema';
import { comment_likesCreateWithoutCommentsInputObjectSchema } from './comment_likesCreateWithoutCommentsInput.schema';
import { comment_likesUncheckedCreateWithoutCommentsInputObjectSchema } from './comment_likesUncheckedCreateWithoutCommentsInput.schema'

export const comment_likesCreateOrConnectWithoutCommentsInputObjectSchema: z.ZodType<Prisma.comment_likesCreateOrConnectWithoutCommentsInput, Prisma.comment_likesCreateOrConnectWithoutCommentsInput> = z.object({
  where: z.lazy(() => comment_likesWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => comment_likesCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_likesUncheckedCreateWithoutCommentsInputObjectSchema)])
}).strict();
export const comment_likesCreateOrConnectWithoutCommentsInputObjectZodSchema = z.object({
  where: z.lazy(() => comment_likesWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => comment_likesCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_likesUncheckedCreateWithoutCommentsInputObjectSchema)])
}).strict();
