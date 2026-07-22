// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { project_collaboratorsCreateWithoutUsersInputObjectSchema } from './project_collaboratorsCreateWithoutUsersInput.schema';
import { project_collaboratorsUncheckedCreateWithoutUsersInputObjectSchema } from './project_collaboratorsUncheckedCreateWithoutUsersInput.schema';
import { project_collaboratorsCreateOrConnectWithoutUsersInputObjectSchema } from './project_collaboratorsCreateOrConnectWithoutUsersInput.schema';
import { project_collaboratorsUpsertWithWhereUniqueWithoutUsersInputObjectSchema } from './project_collaboratorsUpsertWithWhereUniqueWithoutUsersInput.schema';
import { project_collaboratorsCreateManyUsersInputEnvelopeObjectSchema } from './project_collaboratorsCreateManyUsersInputEnvelope.schema';
import { project_collaboratorsWhereUniqueInputObjectSchema } from './project_collaboratorsWhereUniqueInput.schema';
import { project_collaboratorsUpdateWithWhereUniqueWithoutUsersInputObjectSchema } from './project_collaboratorsUpdateWithWhereUniqueWithoutUsersInput.schema';
import { project_collaboratorsUpdateManyWithWhereWithoutUsersInputObjectSchema } from './project_collaboratorsUpdateManyWithWhereWithoutUsersInput.schema';
import { project_collaboratorsScalarWhereInputObjectSchema } from './project_collaboratorsScalarWhereInput.schema'

export const project_collaboratorsUncheckedUpdateManyWithoutUsersNestedInputObjectSchema: z.ZodType<Prisma.project_collaboratorsUncheckedUpdateManyWithoutUsersNestedInput, Prisma.project_collaboratorsUncheckedUpdateManyWithoutUsersNestedInput> = z.object({
  create: z.union([z.lazy(() => project_collaboratorsCreateWithoutUsersInputObjectSchema), z.lazy(() => project_collaboratorsCreateWithoutUsersInputObjectSchema).array(), z.lazy(() => project_collaboratorsUncheckedCreateWithoutUsersInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedCreateWithoutUsersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => project_collaboratorsCreateOrConnectWithoutUsersInputObjectSchema), z.lazy(() => project_collaboratorsCreateOrConnectWithoutUsersInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => project_collaboratorsUpsertWithWhereUniqueWithoutUsersInputObjectSchema), z.lazy(() => project_collaboratorsUpsertWithWhereUniqueWithoutUsersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => project_collaboratorsCreateManyUsersInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema), z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema), z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema), z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema), z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => project_collaboratorsUpdateWithWhereUniqueWithoutUsersInputObjectSchema), z.lazy(() => project_collaboratorsUpdateWithWhereUniqueWithoutUsersInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => project_collaboratorsUpdateManyWithWhereWithoutUsersInputObjectSchema), z.lazy(() => project_collaboratorsUpdateManyWithWhereWithoutUsersInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => project_collaboratorsScalarWhereInputObjectSchema), z.lazy(() => project_collaboratorsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const project_collaboratorsUncheckedUpdateManyWithoutUsersNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => project_collaboratorsCreateWithoutUsersInputObjectSchema), z.lazy(() => project_collaboratorsCreateWithoutUsersInputObjectSchema).array(), z.lazy(() => project_collaboratorsUncheckedCreateWithoutUsersInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedCreateWithoutUsersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => project_collaboratorsCreateOrConnectWithoutUsersInputObjectSchema), z.lazy(() => project_collaboratorsCreateOrConnectWithoutUsersInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => project_collaboratorsUpsertWithWhereUniqueWithoutUsersInputObjectSchema), z.lazy(() => project_collaboratorsUpsertWithWhereUniqueWithoutUsersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => project_collaboratorsCreateManyUsersInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema), z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema), z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema), z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema), z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => project_collaboratorsUpdateWithWhereUniqueWithoutUsersInputObjectSchema), z.lazy(() => project_collaboratorsUpdateWithWhereUniqueWithoutUsersInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => project_collaboratorsUpdateManyWithWhereWithoutUsersInputObjectSchema), z.lazy(() => project_collaboratorsUpdateManyWithWhereWithoutUsersInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => project_collaboratorsScalarWhereInputObjectSchema), z.lazy(() => project_collaboratorsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
