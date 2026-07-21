// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutRelationship_historyInputObjectSchema } from './projectsCreateWithoutRelationship_historyInput.schema';
import { projectsUncheckedCreateWithoutRelationship_historyInputObjectSchema } from './projectsUncheckedCreateWithoutRelationship_historyInput.schema';
import { projectsCreateOrConnectWithoutRelationship_historyInputObjectSchema } from './projectsCreateOrConnectWithoutRelationship_historyInput.schema';
import { projectsUpsertWithoutRelationship_historyInputObjectSchema } from './projectsUpsertWithoutRelationship_historyInput.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsUpdateToOneWithWhereWithoutRelationship_historyInputObjectSchema } from './projectsUpdateToOneWithWhereWithoutRelationship_historyInput.schema';
import { projectsUpdateWithoutRelationship_historyInputObjectSchema } from './projectsUpdateWithoutRelationship_historyInput.schema';
import { projectsUncheckedUpdateWithoutRelationship_historyInputObjectSchema } from './projectsUncheckedUpdateWithoutRelationship_historyInput.schema'

export const projectsUpdateOneWithoutRelationship_historyNestedInputObjectSchema: z.ZodType<Prisma.projectsUpdateOneWithoutRelationship_historyNestedInput, Prisma.projectsUpdateOneWithoutRelationship_historyNestedInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutRelationship_historyInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutRelationship_historyInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutRelationship_historyInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutRelationship_historyInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutRelationship_historyInputObjectSchema), z.lazy(() => projectsUpdateWithoutRelationship_historyInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutRelationship_historyInputObjectSchema)]).optional()
}).strict();
export const projectsUpdateOneWithoutRelationship_historyNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutRelationship_historyInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutRelationship_historyInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutRelationship_historyInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutRelationship_historyInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutRelationship_historyInputObjectSchema), z.lazy(() => projectsUpdateWithoutRelationship_historyInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutRelationship_historyInputObjectSchema)]).optional()
}).strict();
