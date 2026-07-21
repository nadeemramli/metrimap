// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsScalarWhereInputObjectSchema } from './commentsScalarWhereInput.schema';
import { commentsUpdateManyMutationInputObjectSchema } from './commentsUpdateManyMutationInput.schema';
import { commentsUncheckedUpdateManyWithoutCommentsInputObjectSchema } from './commentsUncheckedUpdateManyWithoutCommentsInput.schema'

export const commentsUpdateManyWithWhereWithoutCommentsInputObjectSchema: z.ZodType<Prisma.commentsUpdateManyWithWhereWithoutCommentsInput, Prisma.commentsUpdateManyWithWhereWithoutCommentsInput> = z.object({
  where: z.lazy(() => commentsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => commentsUpdateManyMutationInputObjectSchema), z.lazy(() => commentsUncheckedUpdateManyWithoutCommentsInputObjectSchema)])
}).strict();
export const commentsUpdateManyWithWhereWithoutCommentsInputObjectZodSchema = z.object({
  where: z.lazy(() => commentsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => commentsUpdateManyMutationInputObjectSchema), z.lazy(() => commentsUncheckedUpdateManyWithoutCommentsInputObjectSchema)])
}).strict();
