// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { projectsUpdateWithoutStrategy_impact_contractsInputObjectSchema } from './projectsUpdateWithoutStrategy_impact_contractsInput.schema';
import { projectsUncheckedUpdateWithoutStrategy_impact_contractsInputObjectSchema } from './projectsUncheckedUpdateWithoutStrategy_impact_contractsInput.schema'

export const projectsUpdateToOneWithWhereWithoutStrategy_impact_contractsInputObjectSchema: z.ZodType<Prisma.projectsUpdateToOneWithWhereWithoutStrategy_impact_contractsInput, Prisma.projectsUpdateToOneWithWhereWithoutStrategy_impact_contractsInput> = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutStrategy_impact_contractsInputObjectSchema)])
}).strict();
export const projectsUpdateToOneWithWhereWithoutStrategy_impact_contractsInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutStrategy_impact_contractsInputObjectSchema)])
}).strict();
