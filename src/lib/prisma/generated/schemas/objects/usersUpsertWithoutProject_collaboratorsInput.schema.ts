// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersUpdateWithoutProject_collaboratorsInputObjectSchema } from './usersUpdateWithoutProject_collaboratorsInput.schema';
import { usersUncheckedUpdateWithoutProject_collaboratorsInputObjectSchema } from './usersUncheckedUpdateWithoutProject_collaboratorsInput.schema';
import { usersCreateWithoutProject_collaboratorsInputObjectSchema } from './usersCreateWithoutProject_collaboratorsInput.schema';
import { usersUncheckedCreateWithoutProject_collaboratorsInputObjectSchema } from './usersUncheckedCreateWithoutProject_collaboratorsInput.schema';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema'

export const usersUpsertWithoutProject_collaboratorsInputObjectSchema: z.ZodType<Prisma.usersUpsertWithoutProject_collaboratorsInput, Prisma.usersUpsertWithoutProject_collaboratorsInput> = z.object({
  update: z.union([z.lazy(() => usersUpdateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutProject_collaboratorsInputObjectSchema)]),
  create: z.union([z.lazy(() => usersCreateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutProject_collaboratorsInputObjectSchema)]),
  where: z.lazy(() => usersWhereInputObjectSchema).optional()
}).strict();
export const usersUpsertWithoutProject_collaboratorsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => usersUpdateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutProject_collaboratorsInputObjectSchema)]),
  create: z.union([z.lazy(() => usersCreateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutProject_collaboratorsInputObjectSchema)]),
  where: z.lazy(() => usersWhereInputObjectSchema).optional()
}).strict();
