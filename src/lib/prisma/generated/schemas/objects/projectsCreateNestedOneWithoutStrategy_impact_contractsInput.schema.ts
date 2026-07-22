// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutStrategy_impact_contractsInputObjectSchema } from './projectsCreateWithoutStrategy_impact_contractsInput.schema';
import { projectsUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema } from './projectsUncheckedCreateWithoutStrategy_impact_contractsInput.schema';
import { projectsCreateOrConnectWithoutStrategy_impact_contractsInputObjectSchema } from './projectsCreateOrConnectWithoutStrategy_impact_contractsInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema'

export const projectsCreateNestedOneWithoutStrategy_impact_contractsInputObjectSchema: z.ZodType<Prisma.projectsCreateNestedOneWithoutStrategy_impact_contractsInput, Prisma.projectsCreateNestedOneWithoutStrategy_impact_contractsInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutStrategy_impact_contractsInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
export const projectsCreateNestedOneWithoutStrategy_impact_contractsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutStrategy_impact_contractsInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
