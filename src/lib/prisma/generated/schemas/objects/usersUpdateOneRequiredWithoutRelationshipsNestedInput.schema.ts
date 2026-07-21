// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersCreateWithoutRelationshipsInputObjectSchema } from './usersCreateWithoutRelationshipsInput.schema';
import { usersUncheckedCreateWithoutRelationshipsInputObjectSchema } from './usersUncheckedCreateWithoutRelationshipsInput.schema';
import { usersCreateOrConnectWithoutRelationshipsInputObjectSchema } from './usersCreateOrConnectWithoutRelationshipsInput.schema';
import { usersUpsertWithoutRelationshipsInputObjectSchema } from './usersUpsertWithoutRelationshipsInput.schema';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema';
import { usersUpdateToOneWithWhereWithoutRelationshipsInputObjectSchema } from './usersUpdateToOneWithWhereWithoutRelationshipsInput.schema';
import { usersUpdateWithoutRelationshipsInputObjectSchema } from './usersUpdateWithoutRelationshipsInput.schema';
import { usersUncheckedUpdateWithoutRelationshipsInputObjectSchema } from './usersUncheckedUpdateWithoutRelationshipsInput.schema'

export const usersUpdateOneRequiredWithoutRelationshipsNestedInputObjectSchema: z.ZodType<Prisma.usersUpdateOneRequiredWithoutRelationshipsNestedInput, Prisma.usersUpdateOneRequiredWithoutRelationshipsNestedInput> = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutRelationshipsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutRelationshipsInputObjectSchema).optional(),
  upsert: z.lazy(() => usersUpsertWithoutRelationshipsInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => usersUpdateToOneWithWhereWithoutRelationshipsInputObjectSchema), z.lazy(() => usersUpdateWithoutRelationshipsInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutRelationshipsInputObjectSchema)]).optional()
}).strict();
export const usersUpdateOneRequiredWithoutRelationshipsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutRelationshipsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutRelationshipsInputObjectSchema).optional(),
  upsert: z.lazy(() => usersUpsertWithoutRelationshipsInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => usersUpdateToOneWithWhereWithoutRelationshipsInputObjectSchema), z.lazy(() => usersUpdateWithoutRelationshipsInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutRelationshipsInputObjectSchema)]).optional()
}).strict();
