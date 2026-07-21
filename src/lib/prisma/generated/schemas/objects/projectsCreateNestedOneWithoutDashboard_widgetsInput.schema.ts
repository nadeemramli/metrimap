// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutDashboard_widgetsInputObjectSchema } from './projectsCreateWithoutDashboard_widgetsInput.schema';
import { projectsUncheckedCreateWithoutDashboard_widgetsInputObjectSchema } from './projectsUncheckedCreateWithoutDashboard_widgetsInput.schema';
import { projectsCreateOrConnectWithoutDashboard_widgetsInputObjectSchema } from './projectsCreateOrConnectWithoutDashboard_widgetsInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema'

export const projectsCreateNestedOneWithoutDashboard_widgetsInputObjectSchema: z.ZodType<Prisma.projectsCreateNestedOneWithoutDashboard_widgetsInput, Prisma.projectsCreateNestedOneWithoutDashboard_widgetsInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutDashboard_widgetsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutDashboard_widgetsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutDashboard_widgetsInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
export const projectsCreateNestedOneWithoutDashboard_widgetsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutDashboard_widgetsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutDashboard_widgetsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutDashboard_widgetsInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
