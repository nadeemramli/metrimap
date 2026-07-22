// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema';
import { usersUpdateWithoutChangelogInputObjectSchema } from './usersUpdateWithoutChangelogInput.schema';
import { usersUncheckedUpdateWithoutChangelogInputObjectSchema } from './usersUncheckedUpdateWithoutChangelogInput.schema'

export const usersUpdateToOneWithWhereWithoutChangelogInputObjectSchema: z.ZodType<Prisma.usersUpdateToOneWithWhereWithoutChangelogInput, Prisma.usersUpdateToOneWithWhereWithoutChangelogInput> = z.object({
  where: z.lazy(() => usersWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => usersUpdateWithoutChangelogInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutChangelogInputObjectSchema)])
}).strict();
export const usersUpdateToOneWithWhereWithoutChangelogInputObjectZodSchema = z.object({
  where: z.lazy(() => usersWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => usersUpdateWithoutChangelogInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutChangelogInputObjectSchema)])
}).strict();
