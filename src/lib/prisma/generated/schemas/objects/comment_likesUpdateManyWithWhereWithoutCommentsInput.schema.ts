// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_likesScalarWhereInputObjectSchema } from './comment_likesScalarWhereInput.schema';
import { comment_likesUpdateManyMutationInputObjectSchema } from './comment_likesUpdateManyMutationInput.schema';
import { comment_likesUncheckedUpdateManyWithoutCommentsInputObjectSchema } from './comment_likesUncheckedUpdateManyWithoutCommentsInput.schema'

export const comment_likesUpdateManyWithWhereWithoutCommentsInputObjectSchema: z.ZodType<Prisma.comment_likesUpdateManyWithWhereWithoutCommentsInput, Prisma.comment_likesUpdateManyWithWhereWithoutCommentsInput> = z.object({
  where: z.lazy(() => comment_likesScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => comment_likesUpdateManyMutationInputObjectSchema), z.lazy(() => comment_likesUncheckedUpdateManyWithoutCommentsInputObjectSchema)])
}).strict();
export const comment_likesUpdateManyWithWhereWithoutCommentsInputObjectZodSchema = z.object({
  where: z.lazy(() => comment_likesScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => comment_likesUpdateManyMutationInputObjectSchema), z.lazy(() => comment_likesUncheckedUpdateManyWithoutCommentsInputObjectSchema)])
}).strict();
