// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema';
import { projectsUpdateWithoutDashboard_widgetsInputObjectSchema } from './projectsUpdateWithoutDashboard_widgetsInput.schema';
import { projectsUncheckedUpdateWithoutDashboard_widgetsInputObjectSchema } from './projectsUncheckedUpdateWithoutDashboard_widgetsInput.schema'

export const projectsUpdateToOneWithWhereWithoutDashboard_widgetsInputObjectSchema: z.ZodType<Prisma.projectsUpdateToOneWithWhereWithoutDashboard_widgetsInput, Prisma.projectsUpdateToOneWithWhereWithoutDashboard_widgetsInput> = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutDashboard_widgetsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutDashboard_widgetsInputObjectSchema)])
}).strict();
export const projectsUpdateToOneWithWhereWithoutDashboard_widgetsInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => projectsUpdateWithoutDashboard_widgetsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutDashboard_widgetsInputObjectSchema)])
}).strict();
