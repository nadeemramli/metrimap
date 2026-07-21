// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsScalarWhereInputObjectSchema } from './projectsScalarWhereInput.schema';
import { projectsUpdateManyMutationInputObjectSchema } from './projectsUpdateManyMutationInput.schema';
import { projectsUncheckedUpdateManyWithoutSpacesInputObjectSchema } from './projectsUncheckedUpdateManyWithoutSpacesInput.schema'

export const projectsUpdateManyWithWhereWithoutSpacesInputObjectSchema: z.ZodType<Prisma.projectsUpdateManyWithWhereWithoutSpacesInput, Prisma.projectsUpdateManyWithWhereWithoutSpacesInput> = z.object({
  where: z.lazy(() => projectsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => projectsUpdateManyMutationInputObjectSchema), z.lazy(() => projectsUncheckedUpdateManyWithoutSpacesInputObjectSchema)])
}).strict();
export const projectsUpdateManyWithWhereWithoutSpacesInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => projectsUpdateManyMutationInputObjectSchema), z.lazy(() => projectsUncheckedUpdateManyWithoutSpacesInputObjectSchema)])
}).strict();
