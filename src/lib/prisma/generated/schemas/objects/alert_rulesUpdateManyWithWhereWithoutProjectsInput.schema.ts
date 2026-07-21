// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { alert_rulesScalarWhereInputObjectSchema } from './alert_rulesScalarWhereInput.schema';
import { alert_rulesUpdateManyMutationInputObjectSchema } from './alert_rulesUpdateManyMutationInput.schema';
import { alert_rulesUncheckedUpdateManyWithoutProjectsInputObjectSchema } from './alert_rulesUncheckedUpdateManyWithoutProjectsInput.schema'

export const alert_rulesUpdateManyWithWhereWithoutProjectsInputObjectSchema: z.ZodType<Prisma.alert_rulesUpdateManyWithWhereWithoutProjectsInput, Prisma.alert_rulesUpdateManyWithWhereWithoutProjectsInput> = z.object({
  where: z.lazy(() => alert_rulesScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => alert_rulesUpdateManyMutationInputObjectSchema), z.lazy(() => alert_rulesUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
export const alert_rulesUpdateManyWithWhereWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => alert_rulesScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => alert_rulesUpdateManyMutationInputObjectSchema), z.lazy(() => alert_rulesUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
