// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { relationshipsCreateWithoutUsersInputObjectSchema } from './relationshipsCreateWithoutUsersInput.schema';
import { relationshipsUncheckedCreateWithoutUsersInputObjectSchema } from './relationshipsUncheckedCreateWithoutUsersInput.schema';
import { relationshipsCreateOrConnectWithoutUsersInputObjectSchema } from './relationshipsCreateOrConnectWithoutUsersInput.schema';
import { relationshipsUpsertWithWhereUniqueWithoutUsersInputObjectSchema } from './relationshipsUpsertWithWhereUniqueWithoutUsersInput.schema';
import { relationshipsCreateManyUsersInputEnvelopeObjectSchema } from './relationshipsCreateManyUsersInputEnvelope.schema';
import { relationshipsWhereUniqueInputObjectSchema } from './relationshipsWhereUniqueInput.schema';
import { relationshipsUpdateWithWhereUniqueWithoutUsersInputObjectSchema } from './relationshipsUpdateWithWhereUniqueWithoutUsersInput.schema';
import { relationshipsUpdateManyWithWhereWithoutUsersInputObjectSchema } from './relationshipsUpdateManyWithWhereWithoutUsersInput.schema';
import { relationshipsScalarWhereInputObjectSchema } from './relationshipsScalarWhereInput.schema'

export const relationshipsUpdateManyWithoutUsersNestedInputObjectSchema: z.ZodType<Prisma.relationshipsUpdateManyWithoutUsersNestedInput, Prisma.relationshipsUpdateManyWithoutUsersNestedInput> = z.object({
  create: z.union([z.lazy(() => relationshipsCreateWithoutUsersInputObjectSchema), z.lazy(() => relationshipsCreateWithoutUsersInputObjectSchema).array(), z.lazy(() => relationshipsUncheckedCreateWithoutUsersInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutUsersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationshipsCreateOrConnectWithoutUsersInputObjectSchema), z.lazy(() => relationshipsCreateOrConnectWithoutUsersInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => relationshipsUpsertWithWhereUniqueWithoutUsersInputObjectSchema), z.lazy(() => relationshipsUpsertWithWhereUniqueWithoutUsersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationshipsCreateManyUsersInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => relationshipsUpdateWithWhereUniqueWithoutUsersInputObjectSchema), z.lazy(() => relationshipsUpdateWithWhereUniqueWithoutUsersInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => relationshipsUpdateManyWithWhereWithoutUsersInputObjectSchema), z.lazy(() => relationshipsUpdateManyWithWhereWithoutUsersInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => relationshipsScalarWhereInputObjectSchema), z.lazy(() => relationshipsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const relationshipsUpdateManyWithoutUsersNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => relationshipsCreateWithoutUsersInputObjectSchema), z.lazy(() => relationshipsCreateWithoutUsersInputObjectSchema).array(), z.lazy(() => relationshipsUncheckedCreateWithoutUsersInputObjectSchema), z.lazy(() => relationshipsUncheckedCreateWithoutUsersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => relationshipsCreateOrConnectWithoutUsersInputObjectSchema), z.lazy(() => relationshipsCreateOrConnectWithoutUsersInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => relationshipsUpsertWithWhereUniqueWithoutUsersInputObjectSchema), z.lazy(() => relationshipsUpsertWithWhereUniqueWithoutUsersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => relationshipsCreateManyUsersInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => relationshipsWhereUniqueInputObjectSchema), z.lazy(() => relationshipsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => relationshipsUpdateWithWhereUniqueWithoutUsersInputObjectSchema), z.lazy(() => relationshipsUpdateWithWhereUniqueWithoutUsersInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => relationshipsUpdateManyWithWhereWithoutUsersInputObjectSchema), z.lazy(() => relationshipsUpdateManyWithWhereWithoutUsersInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => relationshipsScalarWhereInputObjectSchema), z.lazy(() => relationshipsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
