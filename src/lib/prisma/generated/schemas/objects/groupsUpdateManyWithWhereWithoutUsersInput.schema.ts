// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { groupsScalarWhereInputObjectSchema } from './groupsScalarWhereInput.schema';
import { groupsUpdateManyMutationInputObjectSchema } from './groupsUpdateManyMutationInput.schema';
import { groupsUncheckedUpdateManyWithoutUsersInputObjectSchema } from './groupsUncheckedUpdateManyWithoutUsersInput.schema'

export const groupsUpdateManyWithWhereWithoutUsersInputObjectSchema: z.ZodType<Prisma.groupsUpdateManyWithWhereWithoutUsersInput, Prisma.groupsUpdateManyWithWhereWithoutUsersInput> = z.object({
  where: z.lazy(() => groupsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => groupsUpdateManyMutationInputObjectSchema), z.lazy(() => groupsUncheckedUpdateManyWithoutUsersInputObjectSchema)])
}).strict();
export const groupsUpdateManyWithWhereWithoutUsersInputObjectZodSchema = z.object({
  where: z.lazy(() => groupsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => groupsUpdateManyMutationInputObjectSchema), z.lazy(() => groupsUncheckedUpdateManyWithoutUsersInputObjectSchema)])
}).strict();
