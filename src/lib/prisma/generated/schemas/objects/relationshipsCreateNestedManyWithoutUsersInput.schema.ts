// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsCreateWithoutUsersInputObjectSchema } from './relationshipsCreateWithoutUsersInput.schema';
import { relationshipsUncheckedCreateWithoutUsersInputObjectSchema } from './relationshipsUncheckedCreateWithoutUsersInput.schema';
import { relationshipsCreateOrConnectWithoutUsersInputObjectSchema } from './relationshipsCreateOrConnectWithoutUsersInput.schema';
import { relationshipsCreateManyUsersInputEnvelopeObjectSchema } from './relationshipsCreateManyUsersInputEnvelope.schema';
import { relationshipsWhereUniqueInputObjectSchema } from './relationshipsWhereUniqueInput.schema'

export const relationshipsCreateNestedManyWithoutUsersInputObjectSchema: z.ZodType<Prisma.relationshipsCreateNestedManyWithoutUsersInput, Prisma.relationshipsCreateNestedManyWithoutUsersInput> = z.object({
  create: z.union([z.lazy(() => relationshipsCreateWithoutUsersInputObjectSchema), z.lazy(() => relationshipsCreateWithoutUsersInputObjectSchema).array(), z.lazy(() => relationshipsUncheckedCreateWithoutUsersInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutUsersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationshipsCreateOrConnectWithoutUsersInputObjectSchema), z.lazy(() => relationshipsCreateOrConnectWithoutUsersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationshipsCreateManyUsersInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const relationshipsCreateNestedManyWithoutUsersInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => relationshipsCreateWithoutUsersInputObjectSchema), z.lazy(() => relationshipsCreateWithoutUsersInputObjectSchema).array(), z.lazy(() => relationshipsUncheckedCreateWithoutUsersInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutUsersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationshipsCreateOrConnectWithoutUsersInputObjectSchema), z.lazy(() => relationshipsCreateOrConnectWithoutUsersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationshipsCreateManyUsersInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
