// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersUpdateWithoutRelationshipsInputObjectSchema } from './usersUpdateWithoutRelationshipsInput.schema';
import { usersUncheckedUpdateWithoutRelationshipsInputObjectSchema } from './usersUncheckedUpdateWithoutRelationshipsInput.schema';
import { usersCreateWithoutRelationshipsInputObjectSchema } from './usersCreateWithoutRelationshipsInput.schema';
import { usersUncheckedCreateWithoutRelationshipsInputObjectSchema } from './usersUncheckedCreateWithoutRelationshipsInput.schema';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema'

export const usersUpsertWithoutRelationshipsInputObjectSchema: z.ZodType<Prisma.usersUpsertWithoutRelationshipsInput, Prisma.usersUpsertWithoutRelationshipsInput> = z.object({
  update: z.union([z.lazy(() => usersUpdateWithoutRelationshipsInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutRelationshipsInputObjectSchema)]),
  create: z.union([z.lazy(() => usersCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutRelationshipsInputObjectSchema)]),
  where: z.lazy(() => usersWhereInputObjectSchema).optional()
}).strict();
export const usersUpsertWithoutRelationshipsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => usersUpdateWithoutRelationshipsInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutRelationshipsInputObjectSchema)]),
  create: z.union([z.lazy(() => usersCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutRelationshipsInputObjectSchema)]),
  where: z.lazy(() => usersWhereInputObjectSchema).optional()
}).strict();
