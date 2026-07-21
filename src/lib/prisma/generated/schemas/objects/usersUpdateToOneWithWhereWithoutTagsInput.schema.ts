// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema';
import { usersUpdateWithoutTagsInputObjectSchema } from './usersUpdateWithoutTagsInput.schema';
import { usersUncheckedUpdateWithoutTagsInputObjectSchema } from './usersUncheckedUpdateWithoutTagsInput.schema'

export const usersUpdateToOneWithWhereWithoutTagsInputObjectSchema: z.ZodType<Prisma.usersUpdateToOneWithWhereWithoutTagsInput, Prisma.usersUpdateToOneWithWhereWithoutTagsInput> = z.object({
  where: z.lazy(() => usersWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => usersUpdateWithoutTagsInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutTagsInputObjectSchema)])
}).strict();
export const usersUpdateToOneWithWhereWithoutTagsInputObjectZodSchema = z.object({
  where: z.lazy(() => usersWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => usersUpdateWithoutTagsInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutTagsInputObjectSchema)])
}).strict();
