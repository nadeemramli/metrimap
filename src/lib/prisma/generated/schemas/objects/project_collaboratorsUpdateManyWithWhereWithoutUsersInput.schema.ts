// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { project_collaboratorsScalarWhereInputObjectSchema } from './project_collaboratorsScalarWhereInput.schema';
import { project_collaboratorsUpdateManyMutationInputObjectSchema } from './project_collaboratorsUpdateManyMutationInput.schema';
import { project_collaboratorsUncheckedUpdateManyWithoutUsersInputObjectSchema } from './project_collaboratorsUncheckedUpdateManyWithoutUsersInput.schema'

export const project_collaboratorsUpdateManyWithWhereWithoutUsersInputObjectSchema: z.ZodType<Prisma.project_collaboratorsUpdateManyWithWhereWithoutUsersInput, Prisma.project_collaboratorsUpdateManyWithWhereWithoutUsersInput> = z.object({
  where: z.lazy(() => project_collaboratorsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => project_collaboratorsUpdateManyMutationInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedUpdateManyWithoutUsersInputObjectSchema)])
}).strict();
export const project_collaboratorsUpdateManyWithWhereWithoutUsersInputObjectZodSchema = z.object({
  where: z.lazy(() => project_collaboratorsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => project_collaboratorsUpdateManyMutationInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedUpdateManyWithoutUsersInputObjectSchema)])
}).strict();
