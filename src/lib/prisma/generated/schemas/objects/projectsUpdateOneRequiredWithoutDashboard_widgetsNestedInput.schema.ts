// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutDashboard_widgetsInputObjectSchema } from './projectsCreateWithoutDashboard_widgetsInput.schema';
import { projectsUncheckedCreateWithoutDashboard_widgetsInputObjectSchema } from './projectsUncheckedCreateWithoutDashboard_widgetsInput.schema';
import { projectsCreateOrConnectWithoutDashboard_widgetsInputObjectSchema } from './projectsCreateOrConnectWithoutDashboard_widgetsInput.schema';
import { projectsUpsertWithoutDashboard_widgetsInputObjectSchema } from './projectsUpsertWithoutDashboard_widgetsInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsUpdateToOneWithWhereWithoutDashboard_widgetsInputObjectSchema } from './projectsUpdateToOneWithWhereWithoutDashboard_widgetsInput.schema';
import { projectsUpdateWithoutDashboard_widgetsInputObjectSchema } from './projectsUpdateWithoutDashboard_widgetsInput.schema';
import { projectsUncheckedUpdateWithoutDashboard_widgetsInputObjectSchema } from './projectsUncheckedUpdateWithoutDashboard_widgetsInput.schema'

export const projectsUpdateOneRequiredWithoutDashboard_widgetsNestedInputObjectSchema: z.ZodType<Prisma.projectsUpdateOneRequiredWithoutDashboard_widgetsNestedInput, Prisma.projectsUpdateOneRequiredWithoutDashboard_widgetsNestedInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutDashboard_widgetsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutDashboard_widgetsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutDashboard_widgetsInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutDashboard_widgetsInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutDashboard_widgetsInputObjectSchema), z.lazy(() => projectsUpdateWithoutDashboard_widgetsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutDashboard_widgetsInputObjectSchema)]).optional()
}).strict();
export const projectsUpdateOneRequiredWithoutDashboard_widgetsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutDashboard_widgetsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutDashboard_widgetsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutDashboard_widgetsInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutDashboard_widgetsInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutDashboard_widgetsInputObjectSchema), z.lazy(() => projectsUpdateWithoutDashboard_widgetsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutDashboard_widgetsInputObjectSchema)]).optional()
}).strict();
