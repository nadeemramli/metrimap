// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersUpdateWithoutGroupsInputObjectSchema } from './usersUpdateWithoutGroupsInput.schema';
import { usersUncheckedUpdateWithoutGroupsInputObjectSchema } from './usersUncheckedUpdateWithoutGroupsInput.schema';
import { usersCreateWithoutGroupsInputObjectSchema } from './usersCreateWithoutGroupsInput.schema';
import { usersUncheckedCreateWithoutGroupsInputObjectSchema } from './usersUncheckedCreateWithoutGroupsInput.schema';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema'

export const usersUpsertWithoutGroupsInputObjectSchema: z.ZodType<Prisma.usersUpsertWithoutGroupsInput, Prisma.usersUpsertWithoutGroupsInput> = z.object({
  update: z.union([z.lazy(() => usersUpdateWithoutGroupsInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutGroupsInputObjectSchema)]),
  create: z.union([z.lazy(() => usersCreateWithoutGroupsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutGroupsInputObjectSchema)]),
  where: z.lazy(() => usersWhereInputObjectSchema).optional()
}).strict();
export const usersUpsertWithoutGroupsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => usersUpdateWithoutGroupsInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutGroupsInputObjectSchema)]),
  create: z.union([z.lazy(() => usersCreateWithoutGroupsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutGroupsInputObjectSchema)]),
  where: z.lazy(() => usersWhereInputObjectSchema).optional()
}).strict();
