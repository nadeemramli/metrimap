// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutAlert_rulesInputObjectSchema } from './projectsCreateWithoutAlert_rulesInput.schema';
import { projectsUncheckedCreateWithoutAlert_rulesInputObjectSchema } from './projectsUncheckedCreateWithoutAlert_rulesInput.schema';
import { projectsCreateOrConnectWithoutAlert_rulesInputObjectSchema } from './projectsCreateOrConnectWithoutAlert_rulesInput.schema';
import { projectsUpsertWithoutAlert_rulesInputObjectSchema } from './projectsUpsertWithoutAlert_rulesInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsUpdateToOneWithWhereWithoutAlert_rulesInputObjectSchema } from './projectsUpdateToOneWithWhereWithoutAlert_rulesInput.schema';
import { projectsUpdateWithoutAlert_rulesInputObjectSchema } from './projectsUpdateWithoutAlert_rulesInput.schema';
import { projectsUncheckedUpdateWithoutAlert_rulesInputObjectSchema } from './projectsUncheckedUpdateWithoutAlert_rulesInput.schema'

export const projectsUpdateOneRequiredWithoutAlert_rulesNestedInputObjectSchema: z.ZodType<Prisma.projectsUpdateOneRequiredWithoutAlert_rulesNestedInput, Prisma.projectsUpdateOneRequiredWithoutAlert_rulesNestedInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutAlert_rulesInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutAlert_rulesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutAlert_rulesInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutAlert_rulesInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutAlert_rulesInputObjectSchema), z.lazy(() => projectsUpdateWithoutAlert_rulesInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutAlert_rulesInputObjectSchema)]).optional()
}).strict();
export const projectsUpdateOneRequiredWithoutAlert_rulesNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutAlert_rulesInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutAlert_rulesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutAlert_rulesInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutAlert_rulesInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutAlert_rulesInputObjectSchema), z.lazy(() => projectsUpdateWithoutAlert_rulesInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutAlert_rulesInputObjectSchema)]).optional()
}).strict();
