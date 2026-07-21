// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsCreateWithoutRelationshipsInputObjectSchema } from './projectsCreateWithoutRelationshipsInput.schema';
import { projectsUncheckedCreateWithoutRelationshipsInputObjectSchema } from './projectsUncheckedCreateWithoutRelationshipsInput.schema'

export const projectsCreateOrConnectWithoutRelationshipsInputObjectSchema: z.ZodType<Prisma.projectsCreateOrConnectWithoutRelationshipsInput, Prisma.projectsCreateOrConnectWithoutRelationshipsInput> = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutRelationshipsInputObjectSchema)])
}).strict();
export const projectsCreateOrConnectWithoutRelationshipsInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutRelationshipsInputObjectSchema)])
}).strict();
