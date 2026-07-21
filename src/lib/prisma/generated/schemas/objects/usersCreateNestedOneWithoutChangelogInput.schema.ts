// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersCreateWithoutChangelogInputObjectSchema } from './usersCreateWithoutChangelogInput.schema';
import { usersUncheckedCreateWithoutChangelogInputObjectSchema } from './usersUncheckedCreateWithoutChangelogInput.schema';
import { usersCreateOrConnectWithoutChangelogInputObjectSchema } from './usersCreateOrConnectWithoutChangelogInput.schema';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema'

export const usersCreateNestedOneWithoutChangelogInputObjectSchema: z.ZodType<Prisma.usersCreateNestedOneWithoutChangelogInput, Prisma.usersCreateNestedOneWithoutChangelogInput> = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutChangelogInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutChangelogInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutChangelogInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional()
}).strict();
export const usersCreateNestedOneWithoutChangelogInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutChangelogInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutChangelogInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutChangelogInputObjectSchema).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional()
}).strict();
