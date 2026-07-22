// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutRelationshipsInputObjectSchema } from './projectsCreateWithoutRelationshipsInput.schema';
import { projectsUncheckedCreateWithoutRelationshipsInputObjectSchema } from './projectsUncheckedCreateWithoutRelationshipsInput.schema';
import { projectsCreateOrConnectWithoutRelationshipsInputObjectSchema } from './projectsCreateOrConnectWithoutRelationshipsInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema'

export const projectsCreateNestedOneWithoutRelationshipsInputObjectSchema: z.ZodType<Prisma.projectsCreateNestedOneWithoutRelationshipsInput, Prisma.projectsCreateNestedOneWithoutRelationshipsInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutRelationshipsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutRelationshipsInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
export const projectsCreateNestedOneWithoutRelationshipsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutRelationshipsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutRelationshipsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutRelationshipsInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
