// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { changelogScalarWhereInputObjectSchema } from './changelogScalarWhereInput.schema';
import { changelogUpdateManyMutationInputObjectSchema } from './changelogUpdateManyMutationInput.schema';
import { changelogUncheckedUpdateManyWithoutProjectsInputObjectSchema } from './changelogUncheckedUpdateManyWithoutProjectsInput.schema'

export const changelogUpdateManyWithWhereWithoutProjectsInputObjectSchema: z.ZodType<Prisma.changelogUpdateManyWithWhereWithoutProjectsInput, Prisma.changelogUpdateManyWithWhereWithoutProjectsInput> = z.object({
  where: z.lazy(() => changelogScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => changelogUpdateManyMutationInputObjectSchema), z.lazy(() => changelogUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
export const changelogUpdateManyWithWhereWithoutProjectsInputObjectZodSchema = z.object({
  where: z.lazy(() => changelogScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => changelogUpdateManyMutationInputObjectSchema), z.lazy(() => changelogUncheckedUpdateManyWithoutProjectsInputObjectSchema)])
}).strict();
