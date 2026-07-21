// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsCreateWithoutStrategy_impact_contractsInputObjectSchema } from './projectsCreateWithoutStrategy_impact_contractsInput.schema';
import { projectsUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema } from './projectsUncheckedCreateWithoutStrategy_impact_contractsInput.schema'

export const projectsCreateOrConnectWithoutStrategy_impact_contractsInputObjectSchema: z.ZodType<Prisma.projectsCreateOrConnectWithoutStrategy_impact_contractsInput, Prisma.projectsCreateOrConnectWithoutStrategy_impact_contractsInput> = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema)])
}).strict();
export const projectsCreateOrConnectWithoutStrategy_impact_contractsInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema)])
}).strict();
