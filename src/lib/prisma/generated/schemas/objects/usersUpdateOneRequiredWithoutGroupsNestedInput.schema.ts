// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersCreateWithoutGroupsInputObjectSchema } from './usersCreateWithoutGroupsInput.schema';
import { usersUncheckedCreateWithoutGroupsInputObjectSchema } from './usersUncheckedCreateWithoutGroupsInput.schema';
import { usersCreateOrConnectWithoutGroupsInputObjectSchema } from './usersCreateOrConnectWithoutGroupsInput.schema';
import { usersUpsertWithoutGroupsInputObjectSchema } from './usersUpsertWithoutGroupsInput.schema';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema';
import { usersUpdateToOneWithWhereWithoutGroupsInputObjectSchema } from './usersUpdateToOneWithWhereWithoutGroupsInput.schema';
import { usersUpdateWithoutGroupsInputObjectSchema } from './usersUpdateWithoutGroupsInput.schema';
import { usersUncheckedUpdateWithoutGroupsInputObjectSchema } from './usersUncheckedUpdateWithoutGroupsInput.schema'

export const usersUpdateOneRequiredWithoutGroupsNestedInputObjectSchema: z.ZodType<Prisma.usersUpdateOneRequiredWithoutGroupsNestedInput, Prisma.usersUpdateOneRequiredWithoutGroupsNestedInput> = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutGroupsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutGroupsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutGroupsInputObjectSchema).optional(),
  upsert: z.lazy(() => usersUpsertWithoutGroupsInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => usersUpdateToOneWithWhereWithoutGroupsInputObjectSchema), z.lazy(() => usersUpdateWithoutGroupsInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutGroupsInputObjectSchema)]).optional()
}).strict();
export const usersUpdateOneRequiredWithoutGroupsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutGroupsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutGroupsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutGroupsInputObjectSchema).optional(),
  upsert: z.lazy(() => usersUpsertWithoutGroupsInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => usersUpdateToOneWithWhereWithoutGroupsInputObjectSchema), z.lazy(() => usersUpdateWithoutGroupsInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutGroupsInputObjectSchema)]).optional()
}).strict();
