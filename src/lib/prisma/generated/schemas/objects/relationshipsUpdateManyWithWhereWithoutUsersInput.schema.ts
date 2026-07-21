// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsScalarWhereInputObjectSchema } from './relationshipsScalarWhereInput.schema';
import { relationshipsUpdateManyMutationInputObjectSchema } from './relationshipsUpdateManyMutationInput.schema';
import { relationshipsUncheckedUpdateManyWithoutUsersInputObjectSchema } from './relationshipsUncheckedUpdateManyWithoutUsersInput.schema'

export const relationshipsUpdateManyWithWhereWithoutUsersInputObjectSchema: z.ZodType<Prisma.relationshipsUpdateManyWithWhereWithoutUsersInput, Prisma.relationshipsUpdateManyWithWhereWithoutUsersInput> = z.object({
  where: z.lazy(() => relationshipsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => relationshipsUpdateManyMutationInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateManyWithoutUsersInputObjectSchema)])
}).strict();
export const relationshipsUpdateManyWithWhereWithoutUsersInputObjectZodSchema = z.object({
  where: z.lazy(() => relationshipsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => relationshipsUpdateManyMutationInputObjectSchema), z.lazy(() => relationshipsUncheckedUpdateManyWithoutUsersInputObjectSchema)])
}).strict();
