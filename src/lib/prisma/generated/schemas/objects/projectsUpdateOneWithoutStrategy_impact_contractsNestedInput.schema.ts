// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutStrategy_impact_contractsInputObjectSchema } from './projectsCreateWithoutStrategy_impact_contractsInput.schema';
import { projectsUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema } from './projectsUncheckedCreateWithoutStrategy_impact_contractsInput.schema';
import { projectsCreateOrConnectWithoutStrategy_impact_contractsInputObjectSchema } from './projectsCreateOrConnectWithoutStrategy_impact_contractsInput.schema';
import { projectsUpsertWithoutStrategy_impact_contractsInputObjectSchema } from './projectsUpsertWithoutStrategy_impact_contractsInput.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsUpdateToOneWithWhereWithoutStrategy_impact_contractsInputObjectSchema } from './projectsUpdateToOneWithWhereWithoutStrategy_impact_contractsInput.schema';
import { projectsUpdateWithoutStrategy_impact_contractsInputObjectSchema } from './projectsUpdateWithoutStrategy_impact_contractsInput.schema';
import { projectsUncheckedUpdateWithoutStrategy_impact_contractsInputObjectSchema } from './projectsUncheckedUpdateWithoutStrategy_impact_contractsInput.schema'

export const projectsUpdateOneWithoutStrategy_impact_contractsNestedInputObjectSchema: z.ZodType<Prisma.projectsUpdateOneWithoutStrategy_impact_contractsNestedInput, Prisma.projectsUpdateOneWithoutStrategy_impact_contractsNestedInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutStrategy_impact_contractsInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutStrategy_impact_contractsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => projectsUpdateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutStrategy_impact_contractsInputObjectSchema)]).optional()
}).strict();
export const projectsUpdateOneWithoutStrategy_impact_contractsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutStrategy_impact_contractsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutStrategy_impact_contractsInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutStrategy_impact_contractsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => projectsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => projectsUpdateWithoutStrategy_impact_contractsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutStrategy_impact_contractsInputObjectSchema)]).optional()
}).strict();
