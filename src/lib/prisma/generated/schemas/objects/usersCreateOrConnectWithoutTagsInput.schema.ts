// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema';
import { usersCreateWithoutTagsInputObjectSchema } from './usersCreateWithoutTagsInput.schema';
import { usersUncheckedCreateWithoutTagsInputObjectSchema } from './usersUncheckedCreateWithoutTagsInput.schema'

export const usersCreateOrConnectWithoutTagsInputObjectSchema: z.ZodType<Prisma.usersCreateOrConnectWithoutTagsInput, Prisma.usersCreateOrConnectWithoutTagsInput> = z.object({
  where: z.lazy(() => usersWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => usersCreateWithoutTagsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutTagsInputObjectSchema)])
}).strict();
export const usersCreateOrConnectWithoutTagsInputObjectZodSchema = z.object({
  where: z.lazy(() => usersWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => usersCreateWithoutTagsInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutTagsInputObjectSchema)])
}).strict();
