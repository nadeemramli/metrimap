// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { project_collaboratorsCreateWithoutProjectsInputObjectSchema } from './project_collaboratorsCreateWithoutProjectsInput.schema';
import { project_collaboratorsUncheckedCreateWithoutProjectsInputObjectSchema } from './project_collaboratorsUncheckedCreateWithoutProjectsInput.schema';
import { project_collaboratorsCreateOrConnectWithoutProjectsInputObjectSchema } from './project_collaboratorsCreateOrConnectWithoutProjectsInput.schema';
import { project_collaboratorsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema } from './project_collaboratorsUpsertWithWhereUniqueWithoutProjectsInput.schema';
import { project_collaboratorsCreateManyProjectsInputEnvelopeObjectSchema } from './project_collaboratorsCreateManyProjectsInputEnvelope.schema';
import { project_collaboratorsWhereUniqueInputObjectSchema } from './project_collaboratorsWhereUniqueInput.schema';
import { project_collaboratorsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema } from './project_collaboratorsUpdateWithWhereUniqueWithoutProjectsInput.schema';
import { project_collaboratorsUpdateManyWithWhereWithoutProjectsInputObjectSchema } from './project_collaboratorsUpdateManyWithWhereWithoutProjectsInput.schema';
import { project_collaboratorsScalarWhereInputObjectSchema } from './project_collaboratorsScalarWhereInput.schema'

export const project_collaboratorsUpdateManyWithoutProjectsNestedInputObjectSchema: z.ZodType<Prisma.project_collaboratorsUpdateManyWithoutProjectsNestedInput, Prisma.project_collaboratorsUpdateManyWithoutProjectsNestedInput> = z.object({
  create: z.union([z.lazy(() => project_collaboratorsCreateWithoutProjectsInputObjectSchema), z.lazy(() => project_collaboratorsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => project_collaboratorsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => project_collaboratorsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => project_collaboratorsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => project_collaboratorsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => project_collaboratorsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => project_collaboratorsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema), z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema), z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema), z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema), z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => project_collaboratorsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => project_collaboratorsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => project_collaboratorsUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => project_collaboratorsUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => project_collaboratorsScalarWhereInputObjectSchema), z.lazy(() => project_collaboratorsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const project_collaboratorsUpdateManyWithoutProjectsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => project_collaboratorsCreateWithoutProjectsInputObjectSchema), z.lazy(() => project_collaboratorsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => project_collaboratorsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => project_collaboratorsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => project_collaboratorsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => project_collaboratorsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => project_collaboratorsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => project_collaboratorsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema), z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema), z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema), z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema), z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => project_collaboratorsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema), z.lazy(() => project_collaboratorsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => project_collaboratorsUpdateManyWithWhereWithoutProjectsInputObjectSchema), z.lazy(() => project_collaboratorsUpdateManyWithWhereWithoutProjectsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => project_collaboratorsScalarWhereInputObjectSchema), z.lazy(() => project_collaboratorsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
