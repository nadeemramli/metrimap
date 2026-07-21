// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsWhereUniqueInputObjectSchema } from './relationshipsWhereUniqueInput.schema';
import { relationshipsUpdateWithoutUsersInputObjectSchema } from './relationshipsUpdateWithoutUsersInput.schema';
import { relationshipsUncheckedUpdateWithoutUsersInputObjectSchema } from './relationshipsUncheckedUpdateWithoutUsersInput.schema'

export const relationshipsUpdateWithWhereUniqueWithoutUsersInputObjectSchema: z.ZodType<Prisma.relationshipsUpdateWithWhereUniqueWithoutUsersInput, Prisma.relationshipsUpdateWithWhereUniqueWithoutUsersInput> = z.object({
  where: z.lazy(() => relationshipsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => relationshipsUpdateWithoutUsersInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutUsersInputObjectSchema)])
}).strict();
export const relationshipsUpdateWithWhereUniqueWithoutUsersInputObjectZodSchema = z.object({
  where: z.lazy(() => relationshipsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => relationshipsUpdateWithoutUsersInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateWithoutUsersInputObjectSchema)])
}).strict();
