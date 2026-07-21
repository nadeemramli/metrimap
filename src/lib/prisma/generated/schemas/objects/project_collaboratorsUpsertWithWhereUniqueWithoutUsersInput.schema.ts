// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { project_collaboratorsWhereUniqueInputObjectSchema } from './project_collaboratorsWhereUniqueInput.schema';
import { project_collaboratorsUpdateWithoutUsersInputObjectSchema } from './project_collaboratorsUpdateWithoutUsersInput.schema';
import { project_collaboratorsUncheckedUpdateWithoutUsersInputObjectSchema } from './project_collaboratorsUncheckedUpdateWithoutUsersInput.schema';
import { project_collaboratorsCreateWithoutUsersInputObjectSchema } from './project_collaboratorsCreateWithoutUsersInput.schema';
import { project_collaboratorsUncheckedCreateWithoutUsersInputObjectSchema } from './project_collaboratorsUncheckedCreateWithoutUsersInput.schema'

export const project_collaboratorsUpsertWithWhereUniqueWithoutUsersInputObjectSchema: z.ZodType<Prisma.project_collaboratorsUpsertWithWhereUniqueWithoutUsersInput, Prisma.project_collaboratorsUpsertWithWhereUniqueWithoutUsersInput> = z.object({
  where: z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => project_collaboratorsUpdateWithoutUsersInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedUpdateWithoutUsersInputObjectSchema)]),
  create: z.union([z.lazy(() => project_collaboratorsCreateWithoutUsersInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedCreateWithoutUsersInputObjectSchema)])
}).strict();
export const project_collaboratorsUpsertWithWhereUniqueWithoutUsersInputObjectZodSchema = z.object({
  where: z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => project_collaboratorsUpdateWithoutUsersInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedUpdateWithoutUsersInputObjectSchema)]),
  create: z.union([z.lazy(() => project_collaboratorsCreateWithoutUsersInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedCreateWithoutUsersInputObjectSchema)])
}).strict();
