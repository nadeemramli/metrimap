// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersCreateWithoutProject_collaboratorsInputObjectSchema } from './usersCreateWithoutProject_collaboratorsInput.schema';
import { usersUncheckedCreateWithoutProject_collaboratorsInputObjectSchema } from './usersUncheckedCreateWithoutProject_collaboratorsInput.schema';
import { usersCreateOrConnectWithoutProject_collaboratorsInputObjectSchema } from './usersCreateOrConnectWithoutProject_collaboratorsInput.schema';
import { usersUpsertWithoutProject_collaboratorsInputObjectSchema } from './usersUpsertWithoutProject_collaboratorsInput.schema';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema';
import { usersUpdateToOneWithWhereWithoutProject_collaboratorsInputObjectSchema } from './usersUpdateToOneWithWhereWithoutProject_collaboratorsInput.schema';
import { usersUpdateWithoutProject_collaboratorsInputObjectSchema } from './usersUpdateWithoutProject_collaboratorsInput.schema';
import { usersUncheckedUpdateWithoutProject_collaboratorsInputObjectSchema } from './usersUncheckedUpdateWithoutProject_collaboratorsInput.schema'

export const usersUpdateOneWithoutProject_collaboratorsNestedInputObjectSchema: z.ZodType<Prisma.usersUpdateOneWithoutProject_collaboratorsNestedInput, Prisma.usersUpdateOneWithoutProject_collaboratorsNestedInput> = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutProject_collaboratorsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutProject_collaboratorsInputObjectSchema).optional(),
  upsert: z.lazy(() => usersUpsertWithoutProject_collaboratorsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => usersUpdateToOneWithWhereWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => usersUpdateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutProject_collaboratorsInputObjectSchema)]).optional()
}).strict();
export const usersUpdateOneWithoutProject_collaboratorsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutProject_collaboratorsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutProject_collaboratorsInputObjectSchema).optional(),
  upsert: z.lazy(() => usersUpsertWithoutProject_collaboratorsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => usersUpdateToOneWithWhereWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => usersUpdateWithoutProject_collaboratorsInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutProject_collaboratorsInputObjectSchema)]).optional()
}).strict();
