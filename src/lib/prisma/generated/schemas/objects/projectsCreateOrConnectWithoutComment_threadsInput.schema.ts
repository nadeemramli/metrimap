// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsCreateWithoutComment_threadsInputObjectSchema } from './projectsCreateWithoutComment_threadsInput.schema';
import { projectsUncheckedCreateWithoutComment_threadsInputObjectSchema } from './projectsUncheckedCreateWithoutComment_threadsInput.schema'

export const projectsCreateOrConnectWithoutComment_threadsInputObjectSchema: z.ZodType<Prisma.projectsCreateOrConnectWithoutComment_threadsInput, Prisma.projectsCreateOrConnectWithoutComment_threadsInput> = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutComment_threadsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutComment_threadsInputObjectSchema)])
}).strict();
export const projectsCreateOrConnectWithoutComment_threadsInputObjectZodSchema = z.object({
  where: z.lazy(() => projectsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => projectsCreateWithoutComment_threadsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutComment_threadsInputObjectSchema)])
}).strict();
