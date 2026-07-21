// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { alert_rulesWhereUniqueInputObjectSchema } from './alert_rulesWhereUniqueInput.schema';
import { alert_rulesCreateWithoutProjectsInputObjectSchema } from './alert_rulesCreateWithoutProjectsInput.schema';
import { alert_rulesUncheckedCreateWithoutProjectsInputObjectSchema } from './alert_rulesUncheckedCreateWithoutProjectsInput.schema'

export const alert_rulesCreateOrConnectWithoutProjectsInputObjectSchema: z.ZodType<Prisma.alert_rulesCreateOrConnectWithoutProjectsInput, Prisma.alert_rulesCreateOrConnectWithoutProjectsInput> = z.object({
  where: z.lazy(() => alert_rulesWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => alert_rulesCreateWithoutProjectsInputObjectSchema), z.lazy(() => alert_rulesUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
export const alert_rulesCreateOrConnectWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => alert_rulesWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => alert_rulesCreateWithoutProjectsInputObjectSchema), z.lazy(() => alert_rulesUncheckedCreateWithoutProjectsInputObjectSchema)])
}).strict();
