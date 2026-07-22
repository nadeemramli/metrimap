// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema';
import { usersCreateWithoutChangelogInputObjectSchema } from './usersCreateWithoutChangelogInput.schema';
import { usersUncheckedCreateWithoutChangelogInputObjectSchema } from './usersUncheckedCreateWithoutChangelogInput.schema'

export const usersCreateOrConnectWithoutChangelogInputObjectSchema: z.ZodType<Prisma.usersCreateOrConnectWithoutChangelogInput, Prisma.usersCreateOrConnectWithoutChangelogInput> = z.object({
  where: z.lazy(() => usersWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => usersCreateWithoutChangelogInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutChangelogInputObjectSchema)])
}).strict();
export const usersCreateOrConnectWithoutChangelogInputObjectZodSchema = z.object({
  where: z.lazy(() => usersWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => usersCreateWithoutChangelogInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutChangelogInputObjectSchema)])
}).strict();
