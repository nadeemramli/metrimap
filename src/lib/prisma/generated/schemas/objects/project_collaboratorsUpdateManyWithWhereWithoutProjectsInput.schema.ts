// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { project_collaboratorsScalarWhereInputObjectSchema } from './project_collaboratorsScalarWhereInput.schema';
import { project_collaboratorsUpdateManyMutationInputObjectSchema } from './project_collaboratorsUpdateManyMutationInput.schema';
import { project_collaboratorsUncheckedUpdateManyWithoutProjectsInputObjectSchema } from './project_collaboratorsUncheckedUpdateManyWithoutProjectsInput.schema'

export const project_collaboratorsUpdateManyWithWhereWithoutProjectsInputObjectSchema: z.ZodType<Prisma.project_collaboratorsUpdateManyWithWhereWithoutProjectsInput, Prisma.project_collaboratorsUpdateManyWithWhereWithoutProjectsInput> = z.object({
  where: z.lazy(() => project_collaboratorsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => project_collaboratorsUpdateManyMutationInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
export const project_collaboratorsUpdateManyWithWhereWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => project_collaboratorsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => project_collaboratorsUpdateManyMutationInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
