// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_threadsWhereUniqueInputObjectSchema } from './comment_threadsWhereUniqueInput.schema';
import { comment_threadsUpdateWithoutProjectsInputObjectSchema } from './comment_threadsUpdateWithoutProjectsInput.schema';
import { comment_threadsUncheckedUpdateWithoutProjectsInputObjectSchema } from './comment_threadsUncheckedUpdateWithoutProjectsInput.schema'

export const comment_threadsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.comment_threadsUpdateWithWhereUniqueWithoutProjectsInput, Prisma.comment_threadsUpdateWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => comment_threadsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => comment_threadsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => comment_threadsUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
export const comment_threadsUpdateWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => comment_threadsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => comment_threadsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => comment_threadsUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
