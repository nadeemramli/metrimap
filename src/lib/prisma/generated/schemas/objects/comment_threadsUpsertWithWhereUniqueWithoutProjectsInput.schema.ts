// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_threadsWhereUniqueInputObjectSchema } from './comment_threadsWhereUniqueInput.schema';
import { comment_threadsUpdateWithoutProjectsInputObjectSchema } from './comment_threadsUpdateWithoutProjectsInput.schema';
import { comment_threadsUncheckedUpdateWithoutProjectsInputObjectSchema } from './comment_threadsUncheckedUpdateWithoutProjectsInput.schema';
import { comment_threadsCreateWithoutProjectsInputObjectSchema } from './comment_threadsCreateWithoutProjectsInput.schema';
import { comment_threadsUncheckedCreateWithoutProjectsInputObjectSchema } from './comment_threadsUncheckedCreateWithoutProjectsInput.schema'

export const comment_threadsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.comment_threadsUpsertWithWhereUniqueWithoutProjectsInput, Prisma.comment_threadsUpsertWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => comment_threadsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => comment_threadsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => comment_threadsUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => comment_threadsCreateWithoutProjectsInputObjectSchema), z.lazy(() => comment_threadsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const comment_threadsUpsertWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => comment_threadsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => comment_threadsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => comment_threadsUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => comment_threadsCreateWithoutProjectsInputObjectSchema), z.lazy(() => comment_threadsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
