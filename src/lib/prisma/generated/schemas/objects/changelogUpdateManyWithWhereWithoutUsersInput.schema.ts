// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { changelogScalarWhereInputObjectSchema } from './changelogScalarWhereInput.schema';
import { changelogUpdateManyMutationInputObjectSchema } from './changelogUpdateManyMutationInput.schema';
import { changelogUncheckedUpdateManyWithoutUsersInputObjectSchema } from './changelogUncheckedUpdateManyWithoutUsersInput.schema'

export const changelogUpdateManyWithWhereWithoutUsersInputObjectSchema: z.ZodType<Prisma.changelogUpdateManyWithWhereWithoutUsersInput, Prisma.changelogUpdateManyWithWhereWithoutUsersInput> = z.object({
  where: z.lazy(() => changelogScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => changelogUpdateManyMutationInputObjectSchema), z.lazy(() => changelogUncheckedUpdateManyWithoutUsersInputObjectSchema)])
}).strict();
export const changelogUpdateManyWithWhereWithoutUsersInputObjectZodSchema = z.object({
  where: z.lazy(() => changelogScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => changelogUpdateManyMutationInputObjectSchema), z.lazy(() => changelogUncheckedUpdateManyWithoutUsersInputObjectSchema)])
}).strict();
