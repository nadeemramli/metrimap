// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_threadsUpdateWithoutCommentsInputObjectSchema } from './comment_threadsUpdateWithoutCommentsInput.schema';
import { comment_threadsUncheckedUpdateWithoutCommentsInputObjectSchema } from './comment_threadsUncheckedUpdateWithoutCommentsInput.schema';
import { comment_threadsCreateWithoutCommentsInputObjectSchema } from './comment_threadsCreateWithoutCommentsInput.schema';
import { comment_threadsUncheckedCreateWithoutCommentsInputObjectSchema } from './comment_threadsUncheckedCreateWithoutCommentsInput.schema';
import { comment_threadsWhereInputObjectSchema } from './comment_threadsWhereInput.schema'

export const comment_threadsUpsertWithoutCommentsInputObjectSchema: z.ZodType<Prisma.comment_threadsUpsertWithoutCommentsInput, Prisma.comment_threadsUpsertWithoutCommentsInput> = z.object({
  update: z.union([z.lazy(() => comment_threadsUpdateWithoutCommentsInputObjectSchema), z.lazy(() => comment_threadsUncheckedUpdateWithoutCommentsInputObjectSchema)]),
  create: z.union([z.lazy(() => comment_threadsCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_threadsUncheckedCreateWithoutCommentsInputObjectSchema)]),
  where: z.lazy(() => comment_threadsWhereInputObjectSchema).optional()
}).strict();
export const comment_threadsUpsertWithoutCommentsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => comment_threadsUpdateWithoutCommentsInputObjectSchema), z.lazy(() => comment_threadsUncheckedUpdateWithoutCommentsInputObjectSchema)]),
  create: z.union([z.lazy(() => comment_threadsCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_threadsUncheckedCreateWithoutCommentsInputObjectSchema)]),
  where: z.lazy(() => comment_threadsWhereInputObjectSchema).optional()
}).strict();
