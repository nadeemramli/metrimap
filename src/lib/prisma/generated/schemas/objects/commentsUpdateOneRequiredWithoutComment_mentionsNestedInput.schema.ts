// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsCreateWithoutComment_mentionsInputObjectSchema } from './commentsCreateWithoutComment_mentionsInput.schema';
import { commentsUncheckedCreateWithoutComment_mentionsInputObjectSchema } from './commentsUncheckedCreateWithoutComment_mentionsInput.schema';
import { commentsCreateOrConnectWithoutComment_mentionsInputObjectSchema } from './commentsCreateOrConnectWithoutComment_mentionsInput.schema';
import { commentsUpsertWithoutComment_mentionsInputObjectSchema } from './commentsUpsertWithoutComment_mentionsInput.schema';
import { commentsWhereUniqueInputObjectSchema } from './commentsWhereUniqueInput.schema';
import { commentsUpdateToOneWithWhereWithoutComment_mentionsInputObjectSchema } from './commentsUpdateToOneWithWhereWithoutComment_mentionsInput.schema';
import { commentsUpdateWithoutComment_mentionsInputObjectSchema } from './commentsUpdateWithoutComment_mentionsInput.schema';
import { commentsUncheckedUpdateWithoutComment_mentionsInputObjectSchema } from './commentsUncheckedUpdateWithoutComment_mentionsInput.schema'

export const commentsUpdateOneRequiredWithoutComment_mentionsNestedInputObjectSchema: z.ZodType<Prisma.commentsUpdateOneRequiredWithoutComment_mentionsNestedInput, Prisma.commentsUpdateOneRequiredWithoutComment_mentionsNestedInput> = z.object({
  create: z.union([z.lazy(() => commentsCreateWithoutComment_mentionsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutComment_mentionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => commentsCreateOrConnectWithoutComment_mentionsInputObjectSchema).optional(),
  upsert: z.lazy(() => commentsUpsertWithoutComment_mentionsInputObjectSchema).optional(),
  connect: z.lazy(() => commentsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => commentsUpdateToOneWithWhereWithoutComment_mentionsInputObjectSchema), z.lazy(() => commentsUpdateWithoutComment_mentionsInputObjectSchema), z.lazy(() => commentsUncheckedUpdateWithoutComment_mentionsInputObjectSchema)]).optional()
}).strict();
export const commentsUpdateOneRequiredWithoutComment_mentionsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => commentsCreateWithoutComment_mentionsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutComment_mentionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => commentsCreateOrConnectWithoutComment_mentionsInputObjectSchema).optional(),
  upsert: z.lazy(() => commentsUpsertWithoutComment_mentionsInputObjectSchema).optional(),
  connect: z.lazy(() => commentsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => commentsUpdateToOneWithWhereWithoutComment_mentionsInputObjectSchema), z.lazy(() => commentsUpdateWithoutComment_mentionsInputObjectSchema), z.lazy(() => commentsUncheckedUpdateWithoutComment_mentionsInputObjectSchema)]).optional()
}).strict();
