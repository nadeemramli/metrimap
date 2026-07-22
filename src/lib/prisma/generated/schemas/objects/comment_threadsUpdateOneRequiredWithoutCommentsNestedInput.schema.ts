// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { comment_threadsCreateWithoutCommentsInputObjectSchema } from './comment_threadsCreateWithoutCommentsInput.schema';
import { comment_threadsUncheckedCreateWithoutCommentsInputObjectSchema } from './comment_threadsUncheckedCreateWithoutCommentsInput.schema';
import { comment_threadsCreateOrConnectWithoutCommentsInputObjectSchema } from './comment_threadsCreateOrConnectWithoutCommentsInput.schema';
import { comment_threadsUpsertWithoutCommentsInputObjectSchema } from './comment_threadsUpsertWithoutCommentsInput.schema';
import { comment_threadsWhereUniqueInputObjectSchema } from './comment_threadsWhereUniqueInput.schema';
import { comment_threadsUpdateToOneWithWhereWithoutCommentsInputObjectSchema } from './comment_threadsUpdateToOneWithWhereWithoutCommentsInput.schema';
import { comment_threadsUpdateWithoutCommentsInputObjectSchema } from './comment_threadsUpdateWithoutCommentsInput.schema';
import { comment_threadsUncheckedUpdateWithoutCommentsInputObjectSchema } from './comment_threadsUncheckedUpdateWithoutCommentsInput.schema'

export const comment_threadsUpdateOneRequiredWithoutCommentsNestedInputObjectSchema: z.ZodType<Prisma.comment_threadsUpdateOneRequiredWithoutCommentsNestedInput, Prisma.comment_threadsUpdateOneRequiredWithoutCommentsNestedInput> = z.object({
  create: z.union([z.lazy(() => comment_threadsCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_threadsUncheckedCreateWithoutCommentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => comment_threadsCreateOrConnectWithoutCommentsInputObjectSchema).optional(),
  upsert: z.lazy(() => comment_threadsUpsertWithoutCommentsInputObjectSchema).optional(),
  connect: z.lazy(() => comment_threadsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => comment_threadsUpdateToOneWithWhereWithoutCommentsInputObjectSchema), z.lazy(() => comment_threadsUpdateWithoutCommentsInputObjectSchema), z.lazy(() => comment_threadsUncheckedUpdateWithoutCommentsInputObjectSchema)]).optional()
}).strict();
export const comment_threadsUpdateOneRequiredWithoutCommentsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => comment_threadsCreateWithoutCommentsInputObjectSchema), z.lazy(() => comment_threadsUncheckedCreateWithoutCommentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => comment_threadsCreateOrConnectWithoutCommentsInputObjectSchema).optional(),
  upsert: z.lazy(() => comment_threadsUpsertWithoutCommentsInputObjectSchema).optional(),
  connect: z.lazy(() => comment_threadsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => comment_threadsUpdateToOneWithWhereWithoutCommentsInputObjectSchema), z.lazy(() => comment_threadsUpdateWithoutCommentsInputObjectSchema), z.lazy(() => comment_threadsUncheckedUpdateWithoutCommentsInputObjectSchema)]).optional()
}).strict();
