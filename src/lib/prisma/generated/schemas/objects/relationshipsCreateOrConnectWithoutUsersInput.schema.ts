// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsWhereUniqueInputObjectSchema } from './relationshipsWhereUniqueInput.schema';
import { relationshipsCreateWithoutUsersInputObjectSchema } from './relationshipsCreateWithoutUsersInput.schema';
import { relationshipsUncheckedCreateWithoutUsersInputObjectSchema } from './relationshipsUncheckedCreateWithoutUsersInput.schema'

export const relationshipsCreateOrConnectWithoutUsersInputObjectSchema: z.ZodType<Prisma.relationshipsCreateOrConnectWithoutUsersInput, Prisma.relationshipsCreateOrConnectWithoutUsersInput> = z.object({
  where: z.lazy(() => relationshipsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => relationshipsCreateWithoutUsersInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutUsersInputObjectSchema)])
}).strict();
export const relationshipsCreateOrConnectWithoutUsersInputObjectZodSchema = z.object({
  where: z.lazy(() => relationshipsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => relationshipsCreateWithoutUsersInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutUsersInputObjectSchema)])
}).strict();
