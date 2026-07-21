// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsUpdateWithoutDashboard_widgetsInputObjectSchema } from './projectsUpdateWithoutDashboard_widgetsInput.schema';
import { projectsUncheckedUpdateWithoutDashboard_widgetsInputObjectSchema } from './projectsUncheckedUpdateWithoutDashboard_widgetsInput.schema';
import { projectsCreateWithoutDashboard_widgetsInputObjectSchema } from './projectsCreateWithoutDashboard_widgetsInput.schema';
import { projectsUncheckedCreateWithoutDashboard_widgetsInputObjectSchema } from './projectsUncheckedCreateWithoutDashboard_widgetsInput.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema'

export const projectsUpsertWithoutDashboard_widgetsInputObjectSchema: z.ZodType<Prisma.projectsUpsertWithoutDashboard_widgetsInput, Prisma.projectsUpsertWithoutDashboard_widgetsInput> = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutDashboard_widgetsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutDashboard_widgetsInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutDashboard_widgetsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutDashboard_widgetsInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
export const projectsUpsertWithoutDashboard_widgetsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutDashboard_widgetsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutDashboard_widgetsInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutDashboard_widgetsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutDashboard_widgetsInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
