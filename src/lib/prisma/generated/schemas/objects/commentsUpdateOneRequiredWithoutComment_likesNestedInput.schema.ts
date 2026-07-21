// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsCreateWithoutComment_likesInputObjectSchema } from './commentsCreateWithoutComment_likesInput.schema';
import { commentsUncheckedCreateWithoutComment_likesInputObjectSchema } from './commentsUncheckedCreateWithoutComment_likesInput.schema';
import { commentsCreateOrConnectWithoutComment_likesInputObjectSchema } from './commentsCreateOrConnectWithoutComment_likesInput.schema';
import { commentsUpsertWithoutComment_likesInputObjectSchema } from './commentsUpsertWithoutComment_likesInput.schema';
import { commentsWhereUniqueInputObjectSchema } from './commentsWhereUniqueInput.schema';
import { commentsUpdateToOneWithWhereWithoutComment_likesInputObjectSchema } from './commentsUpdateToOneWithWhereWithoutComment_likesInput.schema';
import { commentsUpdateWithoutComment_likesInputObjectSchema } from './commentsUpdateWithoutComment_likesInput.schema';
import { commentsUncheckedUpdateWithoutComment_likesInputObjectSchema } from './commentsUncheckedUpdateWithoutComment_likesInput.schema'

export const commentsUpdateOneRequiredWithoutComment_likesNestedInputObjectSchema: z.ZodType<Prisma.commentsUpdateOneRequiredWithoutComment_likesNestedInput, Prisma.commentsUpdateOneRequiredWithoutComment_likesNestedInput> = z.object({
  create: z.union([z.lazy(() => commentsCreateWithoutComment_likesInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutComment_likesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => commentsCreateOrConnectWithoutComment_likesInputObjectSchema).optional(),
  upsert: z.lazy(() => commentsUpsertWithoutComment_likesInputObjectSchema).optional(),
  connect: z.lazy(() => commentsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => commentsUpdateToOneWithWhereWithoutComment_likesInputObjectSchema), z.lazy(() => commentsUpdateWithoutComment_likesInputObjectSchema), z.lazy(() => commentsUncheckedUpdateWithoutComment_likesInputObjectSchema)]).optional()
}).strict();
export const commentsUpdateOneRequiredWithoutComment_likesNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => commentsCreateWithoutComment_likesInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutComment_likesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => commentsCreateOrConnectWithoutComment_likesInputObjectSchema).optional(),
  upsert: z.lazy(() => commentsUpsertWithoutComment_likesInputObjectSchema).optional(),
  connect: z.lazy(() => commentsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => commentsUpdateToOneWithWhereWithoutComment_likesInputObjectSchema), z.lazy(() => commentsUpdateWithoutComment_likesInputObjectSchema), z.lazy(() => commentsUncheckedUpdateWithoutComment_likesInputObjectSchema)]).optional()
}).strict();
