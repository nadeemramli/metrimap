// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { project_collaboratorsCreateWithoutUsersInputObjectSchema } from './project_collaboratorsCreateWithoutUsersInput.schema';
import { project_collaboratorsUncheckedCreateWithoutUsersInputObjectSchema } from './project_collaboratorsUncheckedCreateWithoutUsersInput.schema';
import { project_collaboratorsCreateOrConnectWithoutUsersInputObjectSchema } from './project_collaboratorsCreateOrConnectWithoutUsersInput.schema';
import { project_collaboratorsCreateManyUsersInputEnvelopeObjectSchema } from './project_collaboratorsCreateManyUsersInputEnvelope.schema';
import { project_collaboratorsWhereUniqueInputObjectSchema } from './project_collaboratorsWhereUniqueInput.schema'

export const project_collaboratorsUncheckedCreateNestedManyWithoutUsersInputObjectSchema: z.ZodType<Prisma.project_collaboratorsUncheckedCreateNestedManyWithoutUsersInput, Prisma.project_collaboratorsUncheckedCreateNestedManyWithoutUsersInput> = z.object({
  create: z.union([z.lazy(() => project_collaboratorsCreateWithoutUsersInputObjectSchema), z.lazy(() => project_collaboratorsCreateWithoutUsersInputObjectSchema).array(), z.lazy(() => project_collaboratorsUncheckedCreateWithoutUsersInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedCreateWithoutUsersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => project_collaboratorsCreateOrConnectWithoutUsersInputObjectSchema), z.lazy(() => project_collaboratorsCreateOrConnectWithoutUsersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => project_collaboratorsCreateManyUsersInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema), z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const project_collaboratorsUncheckedCreateNestedManyWithoutUsersInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => project_collaboratorsCreateWithoutUsersInputObjectSchema), z.lazy(() => project_collaboratorsCreateWithoutUsersInputObjectSchema).array(), z.lazy(() => project_collaboratorsUncheckedCreateWithoutUsersInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedCreateWithoutUsersInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => project_collaboratorsCreateOrConnectWithoutUsersInputObjectSchema), z.lazy(() => project_collaboratorsCreateOrConnectWithoutUsersInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => project_collaboratorsCreateManyUsersInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema), z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
