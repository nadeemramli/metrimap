// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsUpdateWithoutSpacesInputObjectSchema } from './projectsUpdateWithoutSpacesInput.schema';
import { projectsUncheckedUpdateWithoutSpacesInputObjectSchema } from './projectsUncheckedUpdateWithoutSpacesInput.schema';
import { projectsCreateWithoutSpacesInputObjectSchema } from './projectsCreateWithoutSpacesInput.schema';
import { projectsUncheckedCreateWithoutSpacesInputObjectSchema } from './projectsUncheckedCreateWithoutSpacesInput.schema'

export const projectsUpsertWithWhereUniqueWithoutSpacesInputObjectSchema: z.ZodType<Prisma.projectsUpsertWithWhereUniqueWithoutSpacesInput, Prisma.projectsUpsertWithWhereUniqueWithoutSpacesInput> = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => projectsUpdateWithoutSpacesInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutSpacesInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutSpacesInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutSpacesInputObjectSchema)])
}).strict();
export const projectsUpsertWithWhereUniqueWithoutSpacesInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => projectsUpdateWithoutSpacesInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutSpacesInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutSpacesInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutSpacesInputObjectSchema)])
}).strict();
