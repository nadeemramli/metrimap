// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsUpdateWithoutStrategy_impact_contractsInputObjectSchema } from './projectsUpdateWithoutStrategy_impact_contractsInput.schema';
import { projectsUncheckedUpdateWithoutStrategy_impact_contractsInputObjectSchema } from './projectsUncheckedUpdateWithoutStrategy_impact_contractsInput.schema';
import { projectsCreateWithoutStrategy_impact_contractsInputObjectSchema } from './projectsCreateWithoutStrategy_impact_contractsInput.schema';
import { projectsUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema } from './projectsUncheckedCreateWithoutStrategy_impact_contractsInput.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema'

export const projectsUpsertWithoutStrategy_impact_contractsInputObjectSchema: z.ZodType<Prisma.projectsUpsertWithoutStrategy_impact_contractsInput, Prisma.projectsUpsertWithoutStrategy_impact_contractsInput> = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutStrategy_impact_contractsInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
export const projectsUpsertWithoutStrategy_impact_contractsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutStrategy_impact_contractsInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
