// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_threadsWhereUniqueInputObjectSchema } from './comment_threadsWhereUniqueInput.schema';
import { comment_threadsCreateWithoutCommentsInputObjectSchema } from './comment_threadsCreateWithoutCommentsInput.schema';
import { comment_threadsUncheckedCreateWithoutCommentsInputObjectSchema } from './comment_threadsUncheckedCreateWithoutCommentsInput.schema'

export const comment_threadsCreateOrConnectWithoutCommentsInputObjectSchema: z.ZodType<Prisma.comment_threadsCreateOrConnectWithoutCommentsInput, Prisma.comment_threadsCreateOrConnectWithoutCommentsInput> = z.object({
  where: z.lazy(() => comment_threadsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => comment_threadsCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_threadsUncheckedCreateWithoutCommentsInputObjectSchema)])
}).strict();
export const comment_threadsCreateOrConnectWithoutCommentsInputObjectZodSchema = z.object({
  where: z.lazy(() => comment_threadsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => comment_threadsCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_threadsUncheckedCreateWithoutCommentsInputObjectSchema)])
}).strict();
