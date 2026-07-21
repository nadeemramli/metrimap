// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_mentionsScalarWhereInputObjectSchema } from './comment_mentionsScalarWhereInput.schema';
import { comment_mentionsUpdateManyMutationInputObjectSchema } from './comment_mentionsUpdateManyMutationInput.schema';
import { comment_mentionsUncheckedUpdateManyWithoutCommentsInputObjectSchema } from './comment_mentionsUncheckedUpdateManyWithoutCommentsInput.schema'

export const comment_mentionsUpdateManyWithWhereWithoutCommentsInputObjectSchema: z.ZodType<Prisma.comment_mentionsUpdateManyWithWhereWithoutCommentsInput, Prisma.comment_mentionsUpdateManyWithWhereWithoutCommentsInput> = z.object({
  where: z.lazy(() => comment_mentionsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => comment_mentionsUpdateManyMutationInputObjectSchema), z.lazy(() => comment_mentionsUncheckedUpdateManyWithoutCommentsInputObjectSchema)])
}).strict();
export const comment_mentionsUpdateManyWithWhereWithoutCommentsInputObjectZodSchema = z.object({
  where: z.lazy(() => comment_mentionsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => comment_mentionsUpdateManyMutationInputObjectSchema), z.lazy(() => comment_mentionsUncheckedUpdateManyWithoutCommentsInputObjectSchema)])
}).strict();
