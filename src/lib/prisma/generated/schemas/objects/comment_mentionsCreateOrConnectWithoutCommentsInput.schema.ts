// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_mentionsWhereUniqueInputObjectSchema } from './comment_mentionsWhereUniqueInput.schema';
import { comment_mentionsCreateWithoutCommentsInputObjectSchema } from './comment_mentionsCreateWithoutCommentsInput.schema';
import { comment_mentionsUncheckedCreateWithoutCommentsInputObjectSchema } from './comment_mentionsUncheckedCreateWithoutCommentsInput.schema'

export const comment_mentionsCreateOrConnectWithoutCommentsInputObjectSchema: z.ZodType<Prisma.comment_mentionsCreateOrConnectWithoutCommentsInput, Prisma.comment_mentionsCreateOrConnectWithoutCommentsInput> = z.object({
  where: z.lazy(() => comment_mentionsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => comment_mentionsCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_mentionsUncheckedCreateWithoutCommentsInputObjectSchema)])
}).strict();
export const comment_mentionsCreateOrConnectWithoutCommentsInputObjectZodSchema = z.object({
  where: z.lazy(() => comment_mentionsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => comment_mentionsCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_mentionsUncheckedCreateWithoutCommentsInputObjectSchema)])
}).strict();
