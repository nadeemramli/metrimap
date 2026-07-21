// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema';
import { usersUpdateWithoutGroupsInputObjectSchema } from './usersUpdateWithoutGroupsInput.schema';
import { usersUncheckedUpdateWithoutGroupsInputObjectSchema } from './usersUncheckedUpdateWithoutGroupsInput.schema'

export const usersUpdateToOneWithWhereWithoutGroupsInputObjectSchema: z.ZodType<Prisma.usersUpdateToOneWithWhereWithoutGroupsInput, Prisma.usersUpdateToOneWithWhereWithoutGroupsInput> = z.object({
  where: z.lazy(() => usersWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => usersUpdateWithoutGroupsInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutGroupsInputObjectSchema)])
}).strict();
export const usersUpdateToOneWithWhereWithoutGroupsInputObjectZodSchema = z.object({
  where: z.lazy(() => usersWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => usersUpdateWithoutGroupsInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutGroupsInputObjectSchema)])
}).strict();
