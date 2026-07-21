// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { project_collaboratorsWhereUniqueInputObjectSchema } from './project_collaboratorsWhereUniqueInput.schema';
import { project_collaboratorsUpdateWithoutProjectsInputObjectSchema } from './project_collaboratorsUpdateWithoutProjectsInput.schema';
import { project_collaboratorsUncheckedUpdateWithoutProjectsInputObjectSchema } from './project_collaboratorsUncheckedUpdateWithoutProjectsInput.schema'

export const project_collaboratorsUpdateWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.project_collaboratorsUpdateWithWhereUniqueWithoutProjectsInput, Prisma.project_collaboratorsUpdateWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => project_collaboratorsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
export const project_collaboratorsUpdateWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => project_collaboratorsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedUpdateWithoutProjectsInputObjectSchema)])
}).strict();
