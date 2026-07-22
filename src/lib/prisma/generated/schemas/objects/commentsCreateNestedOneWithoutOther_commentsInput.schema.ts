// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsCreateWithoutOther_commentsInputObjectSchema } from './commentsCreateWithoutOther_commentsInput.schema';
import { commentsUncheckedCreateWithoutOther_commentsInputObjectSchema } from './commentsUncheckedCreateWithoutOther_commentsInput.schema';
import { commentsCreateOrConnectWithoutOther_commentsInputObjectSchema } from './commentsCreateOrConnectWithoutOther_commentsInput.schema';
import { commentsWhereUniqueInputObjectSchema } from './commentsWhereUniqueInput.schema'

export const commentsCreateNestedOneWithoutOther_commentsInputObjectSchema: z.ZodType<Prisma.commentsCreateNestedOneWithoutOther_commentsInput, Prisma.commentsCreateNestedOneWithoutOther_commentsInput> = z.object({
  create: z.union([z.lazy(() => commentsCreateWithoutOther_commentsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutOther_commentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => commentsCreateOrConnectWithoutOther_commentsInputObjectSchema).optional(),
  connect: z.lazy(() => commentsWhereUniqueInputObjectSchema).optional()
}).strict();
export const commentsCreateNestedOneWithoutOther_commentsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => commentsCreateWithoutOther_commentsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutOther_commentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => commentsCreateOrConnectWithoutOther_commentsInputObjectSchema).optional(),
  connect: z.lazy(() => commentsWhereUniqueInputObjectSchema).optional()
}).strict();
