// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutRelationship_historyInputObjectSchema } from './projectsCreateWithoutRelationship_historyInput.schema';
import { projectsUncheckedCreateWithoutRelationship_historyInputObjectSchema } from './projectsUncheckedCreateWithoutRelationship_historyInput.schema';
import { projectsCreateOrConnectWithoutRelationship_historyInputObjectSchema } from './projectsCreateOrConnectWithoutRelationship_historyInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema'

export const projectsCreateNestedOneWithoutRelationship_historyInputObjectSchema: z.ZodType<Prisma.projectsCreateNestedOneWithoutRelationship_historyInput, Prisma.projectsCreateNestedOneWithoutRelationship_historyInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutRelationship_historyInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutRelationship_historyInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutRelationship_historyInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
export const projectsCreateNestedOneWithoutRelationship_historyInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutRelationship_historyInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutRelationship_historyInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutRelationship_historyInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
