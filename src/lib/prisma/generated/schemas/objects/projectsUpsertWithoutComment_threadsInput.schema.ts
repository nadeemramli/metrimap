// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsUpdateWithoutComment_threadsInputObjectSchema } from './projectsUpdateWithoutComment_threadsInput.schema';
import { projectsUncheckedUpdateWithoutComment_threadsInputObjectSchema } from './projectsUncheckedUpdateWithoutComment_threadsInput.schema';
import { projectsCreateWithoutComment_threadsInputObjectSchema } from './projectsCreateWithoutComment_threadsInput.schema';
import { projectsUncheckedCreateWithoutComment_threadsInputObjectSchema } from './projectsUncheckedCreateWithoutComment_threadsInput.schema';
import { projectsWhereInputObjectSchema } from './projectsWhereInput.schema'

export const projectsUpsertWithoutComment_threadsInputObjectSchema: z.ZodType<Prisma.projectsUpsertWithoutComment_threadsInput, Prisma.projectsUpsertWithoutComment_threadsInput> = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutComment_threadsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutComment_threadsInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutComment_threadsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutComment_threadsInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
export const projectsUpsertWithoutComment_threadsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => projectsUpdateWithoutComment_threadsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutComment_threadsInputObjectSchema)]),
  create: z.union([z.lazy(() => projectsCreateWithoutComment_threadsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutComment_threadsInputObjectSchema)]),
  where: z.lazy(() => projectsWhereInputObjectSchema).optional()
}).strict();
