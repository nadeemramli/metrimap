// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsWhereUniqueInputObjectSchema } from './relationshipsWhereUniqueInput.schema';
import { relationshipsUpdateWithoutUsersInputObjectSchema } from './relationshipsUpdateWithoutUsersInput.schema';
import { relationshipsUncheckedUpdateWithoutUsersInputObjectSchema } from './relationshipsUncheckedUpdateWithoutUsersInput.schema';
import { relationshipsCreateWithoutUsersInputObjectSchema } from './relationshipsCreateWithoutUsersInput.schema';
import { relationshipsUncheckedCreateWithoutUsersInputObjectSchema } from './relationshipsUncheckedCreateWithoutUsersInput.schema'

export const relationshipsUpsertWithWhereUniqueWithoutUsersInputObjectSchema: z.ZodType<Prisma.relationshipsUpsertWithWhereUniqueWithoutUsersInput, Prisma.relationshipsUpsertWithWhereUniqueWithoutUsersInput> = z.object({
  where: z.lazy(() => relationshipsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => relationshipsUpdateWithoutUsersInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutUsersInputObjectSchema)]),
  create: z.union([z.lazy(() => relationshipsCreateWithoutUsersInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutUsersInputObjectSchema)])
}).strict();
export const relationshipsUpsertWithWhereUniqueWithoutUsersInputObjectZodSchema = z.object({
  where: z.lazy(() => relationshipsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => relationshipsUpdateWithoutUsersInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutUsersInputObjectSchema)]),
  create: z.union([z.lazy(() => relationshipsCreateWithoutUsersInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutUsersInputObjectSchema)])
}).strict();
