// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_threadsCreateWithoutCommentsInputObjectSchema } from './comment_threadsCreateWithoutCommentsInput.schema';
import { comment_threadsUncheckedCreateWithoutCommentsInputObjectSchema } from './comment_threadsUncheckedCreateWithoutCommentsInput.schema';
import { comment_threadsCreateOrConnectWithoutCommentsInputObjectSchema } from './comment_threadsCreateOrConnectWithoutCommentsInput.schema';
import { comment_threadsWhereUniqueInputObjectSchema } from './comment_threadsWhereUniqueInput.schema'

export const comment_threadsCreateNestedOneWithoutCommentsInputObjectSchema: z.ZodType<Prisma.comment_threadsCreateNestedOneWithoutCommentsInput, Prisma.comment_threadsCreateNestedOneWithoutCommentsInput> = z.object({
  create: z.union([z.lazy(() => comment_threadsCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_threadsUncheckedCreateWithoutCommentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => comment_threadsCreateOrConnectWithoutCommentsInputObjectSchema).optional(),
  connect: z.lazy(() => comment_threadsWhereUniqueInputObjectSchema).optional()
}).strict();
export const comment_threadsCreateNestedOneWithoutCommentsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => comment_threadsCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_threadsUncheckedCreateWithoutCommentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => comment_threadsCreateOrConnectWithoutCommentsInputObjectSchema).optional(),
  connect: z.lazy(() => comment_threadsWhereUniqueInputObjectSchema).optional()
}).strict();
