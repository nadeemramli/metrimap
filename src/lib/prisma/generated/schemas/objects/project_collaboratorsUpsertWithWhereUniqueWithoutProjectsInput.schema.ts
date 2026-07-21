// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { project_collaboratorsWhereUniqueInputObjectSchema } from './project_collaboratorsWhereUniqueInput.schema';
import { project_collaboratorsUpdateWithoutProjectsInputObjectSchema } from './project_collaboratorsUpdateWithoutProjectsInput.schema';
import { project_collaboratorsUncheckedUpdateWithoutProjectsInputObjectSchema } from './project_collaboratorsUncheckedUpdateWithoutProjectsInput.schema';
import { project_collaboratorsCreateWithoutProjectsInputObjectSchema } from './project_collaboratorsCreateWithoutProjectsInput.schema';
import { project_collaboratorsUncheckedCreateWithoutProjectsInputObjectSchema } from './project_collaboratorsUncheckedCreateWithoutProjectsInput.schema'

export const project_collaboratorsUpsertWithWhereUniqueWithoutProjectsInputObjectSchema: z.ZodType<Prisma.project_collaboratorsUpsertWithWhereUniqueWithoutProjectsInput, Prisma.project_collaboratorsUpsertWithWhereUniqueWithoutProjectsInput> = z.object({
  where: z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => project_collaboratorsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => project_collaboratorsCreateWithoutProjectsInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const project_collaboratorsUpsertWithWhereUniqueWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => project_collaboratorsUpdateWithoutProjectsInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedUpdateWithoutProjectsInputObjectSchema)]),
  create: z.union([z.lazy(() => project_collaboratorsCreateWithoutProjectsInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
