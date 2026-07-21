// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsCreateWithoutSpacesInputObjectSchema } from './projectsCreateWithoutSpacesInput.schema';
import { projectsUncheckedCreateWithoutSpacesInputObjectSchema } from './projectsUncheckedCreateWithoutSpacesInput.schema'

export const projectsCreateOrConnectWithoutSpacesInputObjectSchema: z.ZodType<Prisma.projectsCreateOrConnectWithoutSpacesInput, Prisma.projectsCreateOrConnectWithoutSpacesInput> = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutSpacesInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutSpacesInputObjectSchema)])
}).strict();
export const projectsCreateOrConnectWithoutSpacesInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutSpacesInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutSpacesInputObjectSchema)])
}).strict();
