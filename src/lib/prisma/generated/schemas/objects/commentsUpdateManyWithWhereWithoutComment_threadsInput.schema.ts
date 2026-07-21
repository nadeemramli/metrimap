// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsScalarWhereInputObjectSchema } from './commentsScalarWhereInput.schema';
import { commentsUpdateManyMutationInputObjectSchema } from './commentsUpdateManyMutationInput.schema';
import { commentsUncheckedUpdateManyWithoutComment_threadsInputObjectSchema } from './commentsUncheckedUpdateManyWithoutComment_threadsInput.schema'

export const commentsUpdateManyWithWhereWithoutComment_threadsInputObjectSchema: z.ZodType<Prisma.commentsUpdateManyWithWhereWithoutComment_threadsInput, Prisma.commentsUpdateManyWithWhereWithoutComment_threadsInput> = z.object({
  where: z.lazy(() => commentsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => commentsUpdateManyMutationInputObjectSchema), z.lazy(() => commentsUncheckedUpdateManyWithoutComment_threadsInputObjectSchema)])
}).strict();
export const commentsUpdateManyWithWhereWithoutComment_threadsInputObjectZodSchema = z.object({
  where: z.lazy(() => commentsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => commentsUpdateManyMutationInputObjectSchema), z.lazy(() => commentsUncheckedUpdateManyWithoutComment_threadsInputObjectSchema)])
}).strict();
