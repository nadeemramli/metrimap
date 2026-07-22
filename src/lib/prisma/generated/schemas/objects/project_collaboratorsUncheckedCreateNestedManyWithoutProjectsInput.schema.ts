// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { project_collaboratorsCreateWithoutProjectsInputObjectSchema } from './project_collaboratorsCreateWithoutProjectsInput.schema';
import { project_collaboratorsUncheckedCreateWithoutProjectsInputObjectSchema } from './project_collaboratorsUncheckedCreateWithoutProjectsInput.schema';
import { project_collaboratorsCreateOrConnectWithoutProjectsInputObjectSchema } from './project_collaboratorsCreateOrConnectWithoutProjectsInput.schema';
import { project_collaboratorsCreateManyProjectsInputEnvelopeObjectSchema } from './project_collaboratorsCreateManyProjectsInputEnvelope.schema';
import { project_collaboratorsWhereUniqueInputObjectSchema } from './project_collaboratorsWhereUniqueInput.schema'

export const project_collaboratorsUncheckedCreateNestedManyWithoutProjectsInputObjectSchema: z.ZodType<Prisma.project_collaboratorsUncheckedCreateNestedManyWithoutProjectsInput, Prisma.project_collaboratorsUncheckedCreateNestedManyWithoutProjectsInput> = z.object({
  create: z.union([z.lazy(() => project_collaboratorsCreateWithoutProjectsInputObjectSchema), z.lazy(() => project_collaboratorsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => project_collaboratorsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => project_collaboratorsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => project_collaboratorsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => project_collaboratorsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema), z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const project_collaboratorsUncheckedCreateNestedManyWithoutProjectsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => project_collaboratorsCreateWithoutProjectsInputObjectSchema), z.lazy(() => project_collaboratorsCreateWithoutProjectsInputObjectSchema).array(), z.lazy(() => project_collaboratorsUncheckedCreateWithoutProjectsInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedCreateWithoutProjectsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => project_collaboratorsCreateOrConnectWithoutProjectsInputObjectSchema), z.lazy(() => project_collaboratorsCreateOrConnectWithoutProjectsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => project_collaboratorsCreateManyProjectsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema), z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
