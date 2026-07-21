// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersUpdateWithoutTagsInputObjectSchema } from './usersUpdateWithoutTagsInput.schema';
import { usersUncheckedUpdateWithoutTagsInputObjectSchema } from './usersUncheckedUpdateWithoutTagsInput.schema';
import { usersCreateWithoutTagsInputObjectSchema } from './usersCreateWithoutTagsInput.schema';
import { usersUncheckedCreateWithoutTagsInputObjectSchema } from './usersUncheckedCreateWithoutTagsInput.schema';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema'

export const usersUpsertWithoutTagsInputObjectSchema: z.ZodType<Prisma.usersUpsertWithoutTagsInput, Prisma.usersUpsertWithoutTagsInput> = z.object({
  update: z.union([z.lazy(() => usersUpdateWithoutTagsInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutTagsInputObjectSchema)]),
  create: z.union([z.lazy(() => usersCreateWithoutTagsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutTagsInputObjectSchema)]),
  where: z.lazy(() => usersWhereInputObjectSchema).optional()
}).strict();
export const usersUpsertWithoutTagsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => usersUpdateWithoutTagsInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutTagsInputObjectSchema)]),
  create: z.union([z.lazy(() => usersCreateWithoutTagsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutTagsInputObjectSchema)]),
  where: z.lazy(() => usersWhereInputObjectSchema).optional()
}).strict();
