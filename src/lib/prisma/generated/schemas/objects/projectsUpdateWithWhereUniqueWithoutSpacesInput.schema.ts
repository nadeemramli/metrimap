// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsUpdateWithoutSpacesInputObjectSchema } from './projectsUpdateWithoutSpacesInput.schema';
import { projectsUncheckedUpdateWithoutSpacesInputObjectSchema } from './projectsUncheckedUpdateWithoutSpacesInput.schema'

export const projectsUpdateWithWhereUniqueWithoutSpacesInputObjectSchema: z.ZodType<Prisma.projectsUpdateWithWhereUniqueWithoutSpacesInput, Prisma.projectsUpdateWithWhereUniqueWithoutSpacesInput> = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => projectsUpdateWithoutSpacesInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutSpacesInputObjectSchema)])
}).strict();
export const projectsUpdateWithWhereUniqueWithoutSpacesInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => projectsUpdateWithoutSpacesInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutSpacesInputObjectSchema)])
}).strict();
