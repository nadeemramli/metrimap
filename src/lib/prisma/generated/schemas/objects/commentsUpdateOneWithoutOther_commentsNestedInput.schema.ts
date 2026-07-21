// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { commentsCreateWithoutOther_commentsInputObjectSchema } from './commentsCreateWithoutOther_commentsInput.schema';
import { commentsUncheckedCreateWithoutOther_commentsInputObjectSchema } from './commentsUncheckedCreateWithoutOther_commentsInput.schema';
import { commentsCreateOrConnectWithoutOther_commentsInputObjectSchema } from './commentsCreateOrConnectWithoutOther_commentsInput.schema';
import { commentsUpsertWithoutOther_commentsInputObjectSchema } from './commentsUpsertWithoutOther_commentsInput.schema';
import { commentsWhereInputObjectSchema } from './commentsWhereInput.schema';
import { commentsWhereUniqueInputObjectSchema } from './commentsWhereUniqueInput.schema';
import { commentsUpdateToOneWithWhereWithoutOther_commentsInputObjectSchema } from './commentsUpdateToOneWithWhereWithoutOther_commentsInput.schema';
import { commentsUpdateWithoutOther_commentsInputObjectSchema } from './commentsUpdateWithoutOther_commentsInput.schema';
import { commentsUncheckedUpdateWithoutOther_commentsInputObjectSchema } from './commentsUncheckedUpdateWithoutOther_commentsInput.schema'

export const commentsUpdateOneWithoutOther_commentsNestedInputObjectSchema: z.ZodType<Prisma.commentsUpdateOneWithoutOther_commentsNestedInput, Prisma.commentsUpdateOneWithoutOther_commentsNestedInput> = z.object({
  create: z.union([z.lazy(() => commentsCreateWithoutOther_commentsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutOther_commentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => commentsCreateOrConnectWithoutOther_commentsInputObjectSchema).optional(),
  upsert: z.lazy(() => commentsUpsertWithoutOther_commentsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => commentsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => commentsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => commentsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => commentsUpdateToOneWithWhereWithoutOther_commentsInputObjectSchema), z.lazy(() => commentsUpdateWithoutOther_commentsInputObjectSchema), z.lazy(() => commentsUncheckedUpdateWithoutOther_commentsInputObjectSchema)]).optional()
}).strict();
export const commentsUpdateOneWithoutOther_commentsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => commentsCreateWithoutOther_commentsInputObjectSchema), z.lazy(() => commentsUncheckedCreateWithoutOther_commentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => commentsCreateOrConnectWithoutOther_commentsInputObjectSchema).optional(),
  upsert: z.lazy(() => commentsUpsertWithoutOther_commentsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => commentsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => commentsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => commentsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => commentsUpdateToOneWithWhereWithoutOther_commentsInputObjectSchema), z.lazy(() => commentsUpdateWithoutOther_commentsInputObjectSchema), z.lazy(() => commentsUncheckedUpdateWithoutOther_commentsInputObjectSchema)]).optional()
}).strict();
