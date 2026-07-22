// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersCreateWithoutTagsInputObjectSchema } from './usersCreateWithoutTagsInput.schema';
import { usersUncheckedCreateWithoutTagsInputObjectSchema } from './usersUncheckedCreateWithoutTagsInput.schema';
import { usersCreateOrConnectWithoutTagsInputObjectSchema } from './usersCreateOrConnectWithoutTagsInput.schema';
import { usersUpsertWithoutTagsInputObjectSchema } from './usersUpsertWithoutTagsInput.schema';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema';
import { usersUpdateToOneWithWhereWithoutTagsInputObjectSchema } from './usersUpdateToOneWithWhereWithoutTagsInput.schema';
import { usersUpdateWithoutTagsInputObjectSchema } from './usersUpdateWithoutTagsInput.schema';
import { usersUncheckedUpdateWithoutTagsInputObjectSchema } from './usersUncheckedUpdateWithoutTagsInput.schema'

export const usersUpdateOneWithoutTagsNestedInputObjectSchema: z.ZodType<Prisma.usersUpdateOneWithoutTagsNestedInput, Prisma.usersUpdateOneWithoutTagsNestedInput> = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutTagsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutTagsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutTagsInputObjectSchema).optional(),
  upsert: z.lazy(() => usersUpsertWithoutTagsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => usersUpdateToOneWithWhereWithoutTagsInputObjectSchema), z.lazy(() => usersUpdateWithoutTagsInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutTagsInputObjectSchema)]).optional()
}).strict();
export const usersUpdateOneWithoutTagsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutTagsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutTagsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutTagsInputObjectSchema).optional(),
  upsert: z.lazy(() => usersUpsertWithoutTagsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => usersUpdateToOneWithWhereWithoutTagsInputObjectSchema), z.lazy(() => usersUpdateWithoutTagsInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutTagsInputObjectSchema)]).optional()
}).strict();
