// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_threadsWhereUniqueInputObjectSchema } from './comment_threadsWhereUniqueInput.schema';
import { comment_threadsCreateWithoutProjectsInputObjectSchema } from './comment_threadsCreateWithoutProjectsInput.schema';
import { comment_threadsUncheckedCreateWithoutProjectsInputObjectSchema } from './comment_threadsUncheckedCreateWithoutProjectsInput.schema'

export const comment_threadsCreateOrConnectWithoutProjectsInputObjectSchema: z.ZodType<Prisma.comment_threadsCreateOrConnectWithoutProjectsInput, Prisma.comment_threadsCreateOrConnectWithoutProjectsInput> = z.object({
  where: z.lazy(() => comment_threadsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => comment_threadsCreateWithoutProjectsInputObjectSchema), z.lazy(() => comment_threadsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const comment_threadsCreateOrConnectWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => comment_threadsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => comment_threadsCreateWithoutProjectsInputObjectSchema), z.lazy(() => comment_threadsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
