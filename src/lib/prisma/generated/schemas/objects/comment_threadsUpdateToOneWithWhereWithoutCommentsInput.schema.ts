// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_threadsWhereInputObjectSchema } from './comment_threadsWhereInput.schema';
import { comment_threadsUpdateWithoutCommentsInputObjectSchema } from './comment_threadsUpdateWithoutCommentsInput.schema';
import { comment_threadsUncheckedUpdateWithoutCommentsInputObjectSchema } from './comment_threadsUncheckedUpdateWithoutCommentsInput.schema'

export const comment_threadsUpdateToOneWithWhereWithoutCommentsInputObjectSchema: z.ZodType<Prisma.comment_threadsUpdateToOneWithWhereWithoutCommentsInput, Prisma.comment_threadsUpdateToOneWithWhereWithoutCommentsInput> = z.object({
  where: z.lazy(() => comment_threadsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => comment_threadsUpdateWithoutCommentsInputObjectSchema), z.lazy(() => comment_threadsUncheckedUpdateWithoutCommentsInputObjectSchema)])
}).strict();
export const comment_threadsUpdateToOneWithWhereWithoutCommentsInputObjectZodSchema = z.object({
  where: z.lazy(() => comment_threadsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => comment_threadsUpdateWithoutCommentsInputObjectSchema), z.lazy(() => comment_threadsUncheckedUpdateWithoutCommentsInputObjectSchema)])
}).strict();
