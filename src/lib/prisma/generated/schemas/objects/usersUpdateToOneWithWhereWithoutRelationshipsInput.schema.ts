// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema';
import { usersUpdateWithoutRelationshipsInputObjectSchema } from './usersUpdateWithoutRelationshipsInput.schema';
import { usersUncheckedUpdateWithoutRelationshipsInputObjectSchema } from './usersUncheckedUpdateWithoutRelationshipsInput.schema'

export const usersUpdateToOneWithWhereWithoutRelationshipsInputObjectSchema: z.ZodType<Prisma.usersUpdateToOneWithWhereWithoutRelationshipsInput, Prisma.usersUpdateToOneWithWhereWithoutRelationshipsInput> = z.object({
  where: z.lazy(() => usersWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => usersUpdateWithoutRelationshipsInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutRelationshipsInputObjectSchema)])
}).strict();
export const usersUpdateToOneWithWhereWithoutRelationshipsInputObjectZodSchema = z.object({
  where: z.lazy(() => usersWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => usersUpdateWithoutRelationshipsInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutRelationshipsInputObjectSchema)])
}).strict();
