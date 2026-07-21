// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { usersCreateWithoutChangelogInputObjectSchema } from './usersCreateWithoutChangelogInput.schema';
import { usersUncheckedCreateWithoutChangelogInputObjectSchema } from './usersUncheckedCreateWithoutChangelogInput.schema';
import { usersCreateOrConnectWithoutChangelogInputObjectSchema } from './usersCreateOrConnectWithoutChangelogInput.schema';
import { usersUpsertWithoutChangelogInputObjectSchema } from './usersUpsertWithoutChangelogInput.schema';
import { usersWhereInputObjectSchema } from './usersWhereInput.schema';
import { usersWhereUniqueInputObjectSchema } from './usersWhereUniqueInput.schema';
import { usersUpdateToOneWithWhereWithoutChangelogInputObjectSchema } from './usersUpdateToOneWithWhereWithoutChangelogInput.schema';
import { usersUpdateWithoutChangelogInputObjectSchema } from './usersUpdateWithoutChangelogInput.schema';
import { usersUncheckedUpdateWithoutChangelogInputObjectSchema } from './usersUncheckedUpdateWithoutChangelogInput.schema'

export const usersUpdateOneWithoutChangelogNestedInputObjectSchema: z.ZodType<Prisma.usersUpdateOneWithoutChangelogNestedInput, Prisma.usersUpdateOneWithoutChangelogNestedInput> = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutChangelogInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutChangelogInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutChangelogInputObjectSchema).optional(),
  upsert: z.lazy(() => usersUpsertWithoutChangelogInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => usersUpdateToOneWithWhereWithoutChangelogInputObjectSchema), z.lazy(() => usersUpdateWithoutChangelogInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutChangelogInputObjectSchema)]).optional()
}).strict();
export const usersUpdateOneWithoutChangelogNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => usersCreateWithoutChangelogInputObjectSchema), z.lazy(() => usersUncheckedCreateWithoutChangelogInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => usersCreateOrConnectWithoutChangelogInputObjectSchema).optional(),
  upsert: z.lazy(() => usersUpsertWithoutChangelogInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => usersWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => usersWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => usersUpdateToOneWithWhereWithoutChangelogInputObjectSchema), z.lazy(() => usersUpdateWithoutChangelogInputObjectSchema), z.lazy(() => usersUncheckedUpdateWithoutChangelogInputObjectSchema)]).optional()
}).strict();
