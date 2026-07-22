// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { project_collaboratorsWhereUniqueInputObjectSchema } from './project_collaboratorsWhereUniqueInput.schema';
import { project_collaboratorsUpdateWithoutUsersInputObjectSchema } from './project_collaboratorsUpdateWithoutUsersInput.schema';
import { project_collaboratorsUncheckedUpdateWithoutUsersInputObjectSchema } from './project_collaboratorsUncheckedUpdateWithoutUsersInput.schema'

export const project_collaboratorsUpdateWithWhereUniqueWithoutUsersInputObjectSchema: z.ZodType<Prisma.project_collaboratorsUpdateWithWhereUniqueWithoutUsersInput, Prisma.project_collaboratorsUpdateWithWhereUniqueWithoutUsersInput> = z.object({
  where: z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => project_collaboratorsUpdateWithoutUsersInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedUpdateWithoutUsersInputObjectSchema)])
}).strict();
export const project_collaboratorsUpdateWithWhereUniqueWithoutUsersInputObjectZodSchema = z.object({
  where: z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => project_collaboratorsUpdateWithoutUsersInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedUpdateWithoutUsersInputObjectSchema)])
}).strict();
