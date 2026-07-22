// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { groupsScalarWhereInputObjectSchema } from './groupsScalarWhereInput.schema';
import { groupsUpdateManyMutationInputObjectSchema } from './groupsUpdateManyMutationInput.schema';
import { groupsUncheckedUpdateManyWithoutProjectsInputObjectSchema } from './groupsUncheckedUpdateManyWithoutProjectsInput.schema'

export const groupsUpdateManyWithWhereWithoutProjectsInputObjectSchema: z.ZodType<Prisma.groupsUpdateManyWithWhereWithoutProjectsInput, Prisma.groupsUpdateManyWithWhereWithoutProjectsInput> = z.object({
  where: z.lazy(() => groupsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => groupsUpdateManyMutationInputObjectSchema), z.lazy(() => groupsUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
export const groupsUpdateManyWithWhereWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => groupsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => groupsUpdateManyMutationInputObjectSchema), z.lazy(() => groupsUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
