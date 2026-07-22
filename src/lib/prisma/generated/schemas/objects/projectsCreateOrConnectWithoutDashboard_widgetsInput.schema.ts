// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsCreateWithoutDashboard_widgetsInputObjectSchema } from './projectsCreateWithoutDashboard_widgetsInput.schema';
import { projectsUncheckedCreateWithoutDashboard_widgetsInputObjectSchema } from './projectsUncheckedCreateWithoutDashboard_widgetsInput.schema'

export const projectsCreateOrConnectWithoutDashboard_widgetsInputObjectSchema: z.ZodType<Prisma.projectsCreateOrConnectWithoutDashboard_widgetsInput, Prisma.projectsCreateOrConnectWithoutDashboard_widgetsInput> = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutDashboard_widgetsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutDashboard_widgetsInputObjectSchema)])
}).strict();
export const projectsCreateOrConnectWithoutDashboard_widgetsInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutDashboard_widgetsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutDashboard_widgetsInputObjectSchema)])
}).strict();
