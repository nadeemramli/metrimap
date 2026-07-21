// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersUpdateWithoutChangelogInputObjectSchema } from './usersUpdateWithoutChangelogInput.schema';
import { usersUncheckedUpdateWithoutChangelogInputObjectSchema } from './usersUncheckedUpdateWithoutChangelogInput.schema';
import { usersCreateWithoutChangelogInputObjectSchema } from './usersCreateWithoutChangelogInput.schema';
import { usersUncheckedCreateWithoutChangelogInputObjectSchema } from './usersUncheckedCreateWithoutChangelogInput.schema';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema'

export const usersUpsertWithoutChangelogInputObjectSchema: z.ZodType<Prisma.usersUpsertWithoutChangelogInput, Prisma.usersUpsertWithoutChangelogInput> = z.object({
  update: z.union([z.lazy(() => usersUpdateWithoutChangelogInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutChangelogInputObjectSchema)]),
  create: z.union([z.lazy(() => usersCreateWithoutChangelogInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutChangelogInputObjectSchema)]),
  where: z.lazy(() => usersWhereInputObjectSchema).optional()
}).strict();
export const usersUpsertWithoutChangelogInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => usersUpdateWithoutChangelogInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutChangelogInputObjectSchema)]),
  create: z.union([z.lazy(() => usersCreateWithoutChangelogInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutChangelogInputObjectSchema)]),
  where: z.lazy(() => usersWhereInputObjectSchema).optional()
}).strict();
