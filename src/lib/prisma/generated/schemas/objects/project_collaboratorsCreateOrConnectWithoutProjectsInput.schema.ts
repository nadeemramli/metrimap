// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { project_collaboratorsWhereUniqueInputObjectSchema } from './project_collaboratorsWhereUniqueInput.schema';
import { project_collaboratorsCreateWithoutProjectsInputObjectSchema } from './project_collaboratorsCreateWithoutProjectsInput.schema';
import { project_collaboratorsUncheckedCreateWithoutProjectsInputObjectSchema } from './project_collaboratorsUncheckedCreateWithoutProjectsInput.schema'

export const project_collaboratorsCreateOrConnectWithoutProjectsInputObjectSchema: z.ZodType<Prisma.project_collaboratorsCreateOrConnectWithoutProjectsInput, Prisma.project_collaboratorsCreateOrConnectWithoutProjectsInput> = z.object({
  where: z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => project_collaboratorsCreateWithoutProjectsInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const project_collaboratorsCreateOrConnectWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => project_collaboratorsCreateWithoutProjectsInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
