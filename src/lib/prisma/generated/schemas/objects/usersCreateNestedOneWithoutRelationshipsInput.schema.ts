// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersCreateWithoutRelationshipsInputObjectSchema } from './usersCreateWithoutRelationshipsInput.schema';
import { usersUncheckedCreateWithoutRelationshipsInputObjectSchema } from './usersUncheckedCreateWithoutRelationshipsInput.schema';
import { usersCreateOrConnectWithoutRelationshipsInputObjectSchema } from './usersCreateOrConnectWithoutRelationshipsInput.schema';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema'

export const usersCreateNestedOneWithoutRelationshipsInputObjectSchema: z.ZodType<Prisma.usersCreateNestedOneWithoutRelationshipsInput, Prisma.usersCreateNestedOneWithoutRelationshipsInput> = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutRelationshipsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutRelationshipsInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional()
}).strict();
export const usersCreateNestedOneWithoutRelationshipsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutRelationshipsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutRelationshipsInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional()
}).strict();
