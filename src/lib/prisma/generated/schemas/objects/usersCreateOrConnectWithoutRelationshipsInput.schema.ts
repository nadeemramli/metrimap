// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema';
import { usersCreateWithoutRelationshipsInputObjectSchema } from './usersCreateWithoutRelationshipsInput.schema';
import { usersUncheckedCreateWithoutRelationshipsInputObjectSchema } from './usersUncheckedCreateWithoutRelationshipsInput.schema'

export const usersCreateOrConnectWithoutRelationshipsInputObjectSchema: z.ZodType<Prisma.usersCreateOrConnectWithoutRelationshipsInput, Prisma.usersCreateOrConnectWithoutRelationshipsInput> = z.object({
  where: z.lazy(() => usersWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => usersCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutRelationshipsInputObjectSchema)])
}).strict();
export const usersCreateOrConnectWithoutRelationshipsInputObjectZodSchema = z.object({
  where: z.lazy(() => usersWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => usersCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutRelationshipsInputObjectSchema)])
}).strict();
