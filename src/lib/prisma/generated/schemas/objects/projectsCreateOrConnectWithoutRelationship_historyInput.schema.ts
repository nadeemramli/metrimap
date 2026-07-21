// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsCreateWithoutRelationship_historyInputObjectSchema } from './projectsCreateWithoutRelationship_historyInput.schema';
import { projectsUncheckedCreateWithoutRelationship_historyInputObjectSchema } from './projectsUncheckedCreateWithoutRelationship_historyInput.schema'

export const projectsCreateOrConnectWithoutRelationship_historyInputObjectSchema: z.ZodType<Prisma.projectsCreateOrConnectWithoutRelationship_historyInput, Prisma.projectsCreateOrConnectWithoutRelationship_historyInput> = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutRelationship_historyInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutRelationship_historyInputObjectSchema)])
}).strict();
export const projectsCreateOrConnectWithoutRelationship_historyInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutRelationship_historyInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutRelationship_historyInputObjectSchema)])
}).strict();
