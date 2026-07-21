// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { tagsScalarWhereInputObjectSchema } from './tagsScalarWhereInput.schema';
import { tagsUpdateManyMutationInputObjectSchema } from './tagsUpdateManyMutationInput.schema';
import { tagsUncheckedUpdateManyWithoutUsersInputObjectSchema } from './tagsUncheckedUpdateManyWithoutUsersInput.schema'

export const tagsUpdateManyWithWhereWithoutUsersInputObjectSchema: z.ZodType<Prisma.tagsUpdateManyWithWhereWithoutUsersInput, Prisma.tagsUpdateManyWithWhereWithoutUsersInput> = z.object({
  where: z.lazy(() => tagsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => tagsUpdateManyMutationInputObjectSchema), z.lazy(() => tagsUncheckedUpdateManyWithoutUsersInputObjectSchema)])
}).strict();
export const tagsUpdateManyWithWhereWithoutUsersInputObjectZodSchema = z.object({
  where: z.lazy(() => tagsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => tagsUpdateManyMutationInputObjectSchema), z.lazy(() => tagsUncheckedUpdateManyWithoutUsersInputObjectSchema)])
}).strict();
