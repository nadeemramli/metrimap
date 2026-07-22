// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersCreateWithoutTagsInputObjectSchema } from './usersCreateWithoutTagsInput.schema';
import { usersUncheckedCreateWithoutTagsInputObjectSchema } from './usersUncheckedCreateWithoutTagsInput.schema';
import { usersCreateOrConnectWithoutTagsInputObjectSchema } from './usersCreateOrConnectWithoutTagsInput.schema';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema'

export const usersCreateNestedOneWithoutTagsInputObjectSchema: z.ZodType<Prisma.usersCreateNestedOneWithoutTagsInput, Prisma.usersCreateNestedOneWithoutTagsInput> = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutTagsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutTagsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutTagsInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional()
}).strict();
export const usersCreateNestedOneWithoutTagsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutTagsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutTagsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutTagsInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional()
}).strict();
