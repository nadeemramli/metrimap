// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema';
import { usersUpdateWithoutProject_collaboratorsInputObjectSchema } from './usersUpdateWithoutProject_collaboratorsInput.schema';
import { usersUncheckedUpdateWithoutProject_collaboratorsInputObjectSchema } from './usersUncheckedUpdateWithoutProject_collaboratorsInput.schema'

export const usersUpdateToOneWithWhereWithoutProject_collaboratorsInputObjectSchema: z.ZodType<Prisma.usersUpdateToOneWithWhereWithoutProject_collaboratorsInput, Prisma.usersUpdateToOneWithWhereWithoutProject_collaboratorsInput> = z.object({
  where: z.lazy(() => usersWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => usersUpdateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutProject_collaboratorsInputObjectSchema)])
}).strict();
export const usersUpdateToOneWithWhereWithoutProject_collaboratorsInputObjectZodSchema = z.object({
  where: z.lazy(() => usersWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => usersUpdateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutProject_collaboratorsInputObjectSchema)])
}).strict();
