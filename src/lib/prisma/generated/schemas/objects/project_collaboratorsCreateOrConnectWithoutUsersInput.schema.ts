// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { project_collaboratorsWhereUniqueInputObjectSchema } from './project_collaboratorsWhereUniqueInput.schema';
import { project_collaboratorsCreateWithoutUsersInputObjectSchema } from './project_collaboratorsCreateWithoutUsersInput.schema';
import { project_collaboratorsUncheckedCreateWithoutUsersInputObjectSchema } from './project_collaboratorsUncheckedCreateWithoutUsersInput.schema'

export const project_collaboratorsCreateOrConnectWithoutUsersInputObjectSchema: z.ZodType<Prisma.project_collaboratorsCreateOrConnectWithoutUsersInput, Prisma.project_collaboratorsCreateOrConnectWithoutUsersInput> = z.object({
  where: z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => project_collaboratorsCreateWithoutUsersInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedCreateWithoutUsersInputObjectSchema)])
}).strict();
export const project_collaboratorsCreateOrConnectWithoutUsersInputObjectZodSchema = z.object({
  where: z.lazy(() => project_collaboratorsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => project_collaboratorsCreateWithoutUsersInputObjectSchema), z.lazy(() => project_collaboratorsUncheckedCreateWithoutUsersInputObjectSchema)])
}).strict();
