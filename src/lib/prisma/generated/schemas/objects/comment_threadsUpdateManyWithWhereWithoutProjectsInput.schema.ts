// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_threadsScalarWhereInputObjectSchema } from './comment_threadsScalarWhereInput.schema';
import { comment_threadsUpdateManyMutationInputObjectSchema } from './comment_threadsUpdateManyMutationInput.schema';
import { comment_threadsUncheckedUpdateManyWithoutProjectsInputObjectSchema } from './comment_threadsUncheckedUpdateManyWithoutProjectsInput.schema'

export const comment_threadsUpdateManyWithWhereWithoutProjectsInputObjectSchema: z.ZodType<Prisma.comment_threadsUpdateManyWithWhereWithoutProjectsInput, Prisma.comment_threadsUpdateManyWithWhereWithoutProjectsInput> = z.object({
  where: z.lazy(() => comment_threadsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => comment_threadsUpdateManyMutationInputObjectSchema), z.lazy(() => comment_threadsUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
export const comment_threadsUpdateManyWithWhereWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => comment_threadsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => comment_threadsUpdateManyMutationInputObjectSchema), z.lazy(() => comment_threadsUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
